import type { Dispatch, SetStateAction } from 'react'
import {
  type AIAvailability,
  type Conversation,
  type LanguageModelSession,
  type SummarizeModelSession,
  AIAvailabilityString,
  MessageRole,
  type TranslationLanguagePair,
  SupportedLanguages,
} from '../types/types'
import language from '../lib/language'

// TODO: Add error handling
// class AIResponseError implements Error {
//   public name: string

//   constructor(
//     public type: AIType,
//     public message: string
//   ) {
//     this.name = 'AIResponseError'
//     this.type = type
//     this.message = message
//   }
// }

const nonEnglishLanguages = Object.values(SupportedLanguages).filter(
  lang => lang !== SupportedLanguages.ENGLISH
) as Array<SupportedLanguages>

const isValidTranslationLanguagePair = (languagePair: TranslationLanguagePair) => {
  const { sourceLanguage, targetLanguage } = languagePair

  if (sourceLanguage === targetLanguage) return false
  if (sourceLanguage === SupportedLanguages.ENGLISH) {
    return nonEnglishLanguages.includes(targetLanguage)
  }
  if (targetLanguage === SupportedLanguages.ENGLISH) {
    return nonEnglishLanguages.includes(sourceLanguage)
  }
}

const isPromptAvailable = async () => {
  if (window?.ai?.languageModel) {
    const capabilities = await window.ai.languageModel.capabilities()
    return capabilities.available === AIAvailabilityString.READILY
  }
  return false
}

const isTranslationAvailable = () => Boolean(window?.translation)

const isSummarizationAvailable = async () => {
  if (window?.ai?.summarizer) {
    const capabilities = await window.ai.summarizer.capabilities()
    return capabilities.available === AIAvailabilityString.READILY
  }
  return false
}

export const checkAvailability = async (): Promise<AIAvailability> => {
  const prompt = await isPromptAvailable()
  const summarization = await isSummarizationAvailable()
  const translation = isTranslationAvailable()

  return {
    prompt: {
      available: prompt,
    },
    summarization: {
      available: summarization,
    },
    translation: {
      available: translation,
    },
  }
}

// TODO: Add unsupported language handling
export const getPromptStreamingResponse = async (
  text: string,
  setConversation: Dispatch<SetStateAction<Conversation>>
): Promise<LanguageModelSession> => {
  const userMessage = { id: window.crypto.randomUUID(), text, role: MessageRole.USER }
  setConversation(c => ({
    ...c,
    messages: [...c.messages, userMessage],
  }))
  const session = await window.ai.languageModel.create()

  //   const promptTokens = await session.countPromptTokens(text)
  //   if (promptTokens > session.tokensLeft) {
  //     // throw new AIResponseError(AIType.PROMPT, language.en.errors.ai.promptTooLong)
  //   }

  const messageId = window.crypto.randomUUID()

  const response = { id: messageId, text: '', role: MessageRole.SYSTEM }
  setConversation(conversation => ({
    ...conversation,
    messages: [...conversation.messages, response],
  }))

  const stream = await session.promptStreaming(text)
  for await (const chunk of stream) {
    setConversation(conversation => ({
      ...conversation,
      messages: conversation.messages.map(message =>
        message.id === messageId ? { ...message, text: chunk.trim() } : message
      ),
    }))
  }

  return session
}

export const getTranslation = async (
  text: string,
  setConversation: Dispatch<SetStateAction<Conversation>>,
  languagePair: TranslationLanguagePair
) => {
  const messageId = window.crypto.randomUUID()
  const userMessage = { id: window.crypto.randomUUID(), text, role: MessageRole.USER }
  setConversation(c => ({
    ...c,
    messages: [...c.messages, userMessage],
  }))

  const isValidPair = isValidTranslationLanguagePair(languagePair)
  const canTranslate = await window.translation.canTranslate(languagePair)

  if (!isValidPair || canTranslate !== AIAvailabilityString.READILY) {
    setConversation(conversation => ({
      ...conversation,
      messages: [
        ...conversation.messages,
        { id: messageId, text: language.en.errors.ai.invalidLanguagePair, role: MessageRole.SYSTEM },
      ],
    }))
    return
  }

  const translator = await window.translation.createTranslator(languagePair)

  const translation = await translator.translate(text)

  const response = { id: messageId, text: translation, role: MessageRole.SYSTEM }

  setConversation(conversation => ({
    ...conversation,
    messages: [...conversation.messages, response],
  }))
}

export const getSummary = async (
  text: string,
  setConversation: Dispatch<SetStateAction<Conversation>>
): Promise<SummarizeModelSession> => {
  const userMessage = { id: window.crypto.randomUUID(), text, role: MessageRole.USER }
  setConversation(c => ({
    ...c,
    messages: [...c.messages, userMessage],
  }))
  const summarizer = await window.ai.summarizer.create()

  const summary = await summarizer.summarize(text)

  const messageId = window.crypto.randomUUID()

  const response = { id: messageId, text: summary, role: MessageRole.SYSTEM }

  setConversation(conversation => ({
    ...conversation,
    messages: [...conversation.messages, response],
  }))

  return summarizer
}
