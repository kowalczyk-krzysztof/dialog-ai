import type { Dispatch, SetStateAction } from 'react'
import {
  type AIApiAvailability,
  type Conversation,
  type LanguageModelSession,
  type SummarizationModelSession,
  type TranslationLanguagePair,
  AIApiAvailabilityString,
  AIApiType,
  MessageRole,
  SupportedLanguages,
  TranslationModelSession,
} from '../types/types'
import i18n from '../i118n'

export const languageTagToHumanReadable = (
  languageTag: SupportedLanguages,
  targetLanguage: SupportedLanguages = SupportedLanguages.ENGLISH
) => {
  const displayNames = new Intl.DisplayNames([targetLanguage], { type: 'language' })
  return displayNames.of(languageTag)
}

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

interface UserMessageParams {
  conversation: Conversation
  text: string
}
interface SystemMessageParams extends UserMessageParams {
  type?: AIApiType
  isError?: boolean
  id?: string
}

const createSystemMessage = ({ conversation, text, isError = false, id, type }: SystemMessageParams) => {
  if (id) {
    if (!conversation.messages.find(message => message.id === id)) {
      return {
        ...conversation,
        messages: [
          ...conversation.messages,
          {
            id,
            text,
            type,
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
    messages: [
      ...conversation.messages,
      { id: window.crypto.randomUUID(), text, isError, role: MessageRole.SYSTEM, type },
    ],
  }
}

const createUserMessage = ({ conversation, text }: UserMessageParams) => ({
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
  [AIApiType.PROMPT]: {
    available: false,
  },
  [AIApiType.SUMMARIZATION]: {
    available: false,
  },
  [AIApiType.TRANSLATION]: {
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
  setConversation: Dispatch<SetStateAction<Conversation>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
): Promise<LanguageModelSession> => {
  setConversation(conversation => createUserMessage({ conversation, text }))

  const session = await window.ai.languageModel.create()

  const stream = await session.promptStreaming(text)
  const reponseId = window.crypto.randomUUID()
  for await (const chunk of stream) {
    setIsLoading(false)
    setConversation(conversation =>
      createSystemMessage({ conversation, text: chunk.trim(), id: reponseId, type: AIApiType.PROMPT })
    )
  }

  return session
}

const createTranslator = async (
  languagePair: TranslationLanguagePair,
  setConversation: Dispatch<SetStateAction<Conversation>>
): Promise<TranslationModelSession | undefined> => {
  try {
    const translator = await window.translation.createTranslator(languagePair)
    return translator
  } catch (_) {
    const couldNotCreateTranslatorText = i18n.t('errors.ai.couldNotCreateTranslator')
    setConversation(conversation =>
      createSystemMessage({
        conversation,
        text: couldNotCreateTranslatorText,
        isError: true,
        type: AIApiType.TRANSLATION,
      })
    )
  }
}

export const getTranslation = async (
  text: string,
  languagePair: TranslationLanguagePair,
  setConversation: Dispatch<SetStateAction<Conversation>>
) => {
  if (!window.translation) {
    const translationNotEnabledText = i18n.t('errors.ai.translationNotEnabled')
    setConversation(conversation =>
      createSystemMessage({
        conversation,
        text: translationNotEnabledText,
        isError: true,
        type: AIApiType.TRANSLATION,
      })
    )
    return
  }
  const reponseId = window.crypto.randomUUID()

  setConversation(conversation => createUserMessage({ conversation, text }))

  const isValidPair = isValidTranslationLanguagePair(languagePair)

  if (!isValidPair) {
    const invalidLanguagePairText = i18n.t('errors.ai.translationNotEnabled')
    setConversation(conversation =>
      createSystemMessage({
        conversation,
        text: invalidLanguagePairText,
        isError: true,
        type: AIApiType.TRANSLATION,
      })
    )
    return
  }

  const isTranslationDownloadedForLanguagePair = await window.translation.canTranslate(languagePair)

  if (!isTranslationDownloadedForLanguagePair) {
    const translationNotDownloadedText = i18n.t('errors.ai.translationNotDownloaded')
    setConversation(conversation =>
      createSystemMessage({
        conversation,
        text: translationNotDownloadedText,
        isError: true,
        type: AIApiType.TRANSLATION,
      })
    )
    return
  }

  const translator = await createTranslator(languagePair, setConversation)

  if (!translator) {
    return
  }

  try {
    const translation = await translator.translate(text)
    setConversation(conversation =>
      createSystemMessage({ conversation, text: translation, id: reponseId, type: AIApiType.TRANSLATION })
    )
  } catch (e) {
    const unknownError = i18n.t('errors.ai.unknownError')
    setConversation(conversation =>
      createSystemMessage({ conversation, text: unknownError, id: reponseId, type: AIApiType.TRANSLATION })
    )
  }
}

export const getSummary = async (
  text: string,
  setConversation: Dispatch<SetStateAction<Conversation>>
): Promise<SummarizationModelSession> => {
  const reponseId = window.crypto.randomUUID()

  setConversation(conversation => createUserMessage({ conversation, text }))

  const summarizer = await window.ai.summarizer.create()

  const summary = await summarizer.summarize(text)

  setConversation(conversation =>
    createSystemMessage({ conversation, id: reponseId, text: summary, type: AIApiType.SUMMARIZATION })
  )

  return summarizer
}
