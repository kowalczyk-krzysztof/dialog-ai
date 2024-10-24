import type { Dispatch, SetStateAction } from 'react'
import {
  type AIApiAvailability,
  type Conversation,
  type LanguageModelSession,
  type SummarizationModelSession,
  type TranslationLanguagePair,
  AIApiAvailabilityString,
  MessageRole,
  SupportedLanguages,
} from '../types/types'
import i18n from '../i118n'

const nonEnglishLanguages = Object.values(SupportedLanguages).filter(
  language => language !== SupportedLanguages.ENGLISH
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

interface MessageParams {
  conversation: Conversation
  text: string
  isError?: boolean
  id?: string
}

const createSystemMessage = ({ conversation, text, isError = false, id }: MessageParams) => {
  if (id) {
    if (!conversation.messages.find(message => message.id === id)) {
      return {
        ...conversation,
        messages: [
          ...conversation.messages,
          {
            id,
            text,
            role: MessageRole.SYSTEM,
            isError,
          },
        ],
      }
    }

    return {
      ...conversation,
      messages: conversation.messages.map(message => (message.id === id ? { ...message, text, isError } : message)),
    }
  }

  return {
    ...conversation,
    messages: [...conversation.messages, { id: window.crypto.randomUUID(), text, isError, role: MessageRole.SYSTEM }],
  }
}

const createUserMessage = ({ conversation, text }: MessageParams) => ({
  ...conversation,
  messages: [
    ...conversation.messages,
    {
      id: window.crypto.randomUUID(),
      text,
      role: MessageRole.USER,
    },
  ],
})

const isPromptAvailable = async () => {
  if (window?.ai?.languageModel) {
    const capabilities = await window.ai.languageModel.capabilities()
    return capabilities.available === AIApiAvailabilityString.READILY
  }
  return false
}

const isTranslationAvailable = () => Boolean(window?.translation)

const isSummarizationAvailable = async () => {
  if (window?.ai?.summarizer) {
    const capabilities = await window.ai.summarizer.capabilities()
    return capabilities.available === AIApiAvailabilityString.READILY
  }
  return false
}

export const defaultAIApiAvailability: AIApiAvailability = {
  prompt: {
    available: false,
  },
  summarization: {
    available: false,
  },
  translation: {
    available: false,
  },
}

export const checkAIApiAvailability = async (): Promise<AIApiAvailability> => {
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
  setConversation(conversation => createUserMessage({ conversation, text }))

  const session = await window.ai.languageModel.create()

  const stream = await session.promptStreaming(text)
  const reponseId = window.crypto.randomUUID()
  for await (const chunk of stream) {
    setConversation(conversation => createSystemMessage({ conversation, text: chunk.trim(), id: reponseId }))
  }

  return session
}

export const getTranslation = async (
  text: string,
  languagePair: TranslationLanguagePair,
  setConversation: Dispatch<SetStateAction<Conversation>>
) => {
  if (!window.translation) {
    setConversation(conversation =>
      createSystemMessage({ conversation, text: i18n.t('errors.ai.translationNotEnabled'), isError: true })
    )
    return
  }
  const reponseId = window.crypto.randomUUID()

  setConversation(conversation => createUserMessage({ conversation, text }))

  const isValidPair = isValidTranslationLanguagePair(languagePair)
  const canTranslate = await window.translation.canTranslate(languagePair)

  if (!isValidPair || canTranslate !== AIApiAvailabilityString.READILY) {
    setConversation(conversation =>
      createSystemMessage({ conversation, text: i18n.t('errors.ai.invalidLanguagePair'), isError: true })
    )
    return
  }

  const translator = await window.translation.createTranslator(languagePair)

  const translation = await translator.translate(text)

  setConversation(conversation => createSystemMessage({ conversation, text: translation, id: reponseId }))
}

export const getSummary = async (
  text: string,
  setConversation: Dispatch<SetStateAction<Conversation>>
): Promise<SummarizationModelSession> => {
  const reponseId = window.crypto.randomUUID()

  setConversation(conversation => createUserMessage({ conversation, text }))

  const summarizer = await window.ai.summarizer.create()

  const summary = await summarizer.summarize(text)

  setConversation(conversation => createSystemMessage({ conversation, id: reponseId, text: summary }))

  return summarizer
}
