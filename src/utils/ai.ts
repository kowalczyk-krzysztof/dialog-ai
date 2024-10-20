import type { Dispatch, SetStateAction } from 'react'
import language from '../lib/language'
import {
  type AIAvailability,
  type Conversation,
  type LanguageModelSession,
  type SummarizeModelSession,
  AIAvailabilityString,
  MessageRole,
} from '../types/types'

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

// TODO: Fix the isFirst logic
const isFirstMessage = (conversation: Conversation) => conversation.messages.length === 1

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
  setConversation: Dispatch<SetStateAction<Conversation>>,
  conversation: Conversation
): Promise<LanguageModelSession> => {
  const session = await window.ai.languageModel.create({
    systemPrompt: language.en.ai.explainSystemPrompt,
  })

  //   const promptTokens = await session.countPromptTokens(text)
  //   if (promptTokens > session.tokensLeft) {
  //     // throw new AIResponseError(AIType.PROMPT, language.en.errors.ai.promptTooLong)
  //   }

  const stream = await session.promptStreaming(text)
  for await (const chunk of stream) {
    const isFirst = isFirstMessage(conversation)
    const response = { id: 'system', text: chunk.trim(), role: MessageRole.SYSTEM }
    setConversation({
      ...conversation,
      messages: isFirst ? [response] : [...conversation.messages, response],
    })
  }

  return session
}

// TODO: Add multi-language support
export const getTranslation = async (
  text: string,
  setConversation: Dispatch<SetStateAction<Conversation>>,
  conversation: Conversation
) => {
  const languagePair = {
    sourceLanguage: 'en', // Or detect the source language with the Language Detection API
    targetLanguage: 'es',
  }

  const translator = await window.translation.createTranslator(languagePair)
  const translation = await translator.translate(text)

  const isFirst = isFirstMessage(conversation)
  const response = { id: 'system', text: translation, role: MessageRole.SYSTEM }

  setConversation({
    ...conversation,
    messages: isFirst ? [response] : [...conversation.messages, response],
  })
}

export const getSummary = async (
  text: string,
  setConversation: Dispatch<SetStateAction<Conversation>>,
  conversation: Conversation
): Promise<SummarizeModelSession> => {
  const summarizer = await window.ai.summarizer.create()

  const summary = await summarizer.summarize(text)
  const isFirst = isFirstMessage(conversation)
  const response = { id: 'system', text: summary, role: MessageRole.SYSTEM }

  setConversation({
    ...conversation,
    messages: isFirst ? [response] : [...conversation.messages, response],
  })

  return summarizer
}
