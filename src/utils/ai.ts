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

const isChatAvailable = async () => {
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
  [AIApiType.CHAT]: {
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
  const chat = await isChatAvailable()
  const summarization = await isSummarizationAvailable()
  const translation = isTranslationAvailable()

  return {
    chat: {
      available: chat,
    },
    summarization: {
      available: summarization,
    },
    translation: {
      available: translation,
    },
  }
}

const createLanguageModel = async (
  setConversation: Dispatch<SetStateAction<Conversation>>
): Promise<LanguageModelSession | undefined> => {
  try {
    const session = await window.ai.languageModel.create()
    return session
  } catch (_) {
    const couldNotCreateLanguageModelText = i18n.t('errors.ai.couldNotCreateLanguageModel')
    setConversation(conversation =>
      createSystemMessage({
        conversation,
        text: couldNotCreateLanguageModelText,
        isError: true,
        type: AIApiType.CHAT,
      })
    )
  }
}

export const getChatStreamingResponse = async (
  text: string,
  setConversation: Dispatch<SetStateAction<Conversation>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
): Promise<LanguageModelSession | undefined> => {
  setConversation(conversation => createUserMessage({ conversation, text }))
  if (!window.ai) {
    const aiNotEnabledText = i18n.t('errors.ai.aiNotEnabled')
    setConversation(conversation =>
      createSystemMessage({
        conversation,
        text: aiNotEnabledText,
        isError: true,
        type: AIApiType.SUMMARIZATION,
      })
    )
    return
  }

  const session = await createLanguageModel(setConversation)

  if (!session) {
    return
  }

  try {
    const stream = await session.promptStreaming(text)
    const reponseId = window.crypto.randomUUID()
    for await (const chunk of stream) {
      setIsLoading(false)
      setConversation(conversation =>
        createSystemMessage({ conversation, text: chunk.trim(), id: reponseId, type: AIApiType.CHAT })
      )
    }
    return session
  } catch (error) {
    const unknownError = i18n.t('errors.ai.unknownError')
    setConversation(conversation =>
      createSystemMessage({ conversation, text: unknownError, type: AIApiType.CHAT, isError: true })
    )
  }
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
  setConversation(conversation => createUserMessage({ conversation, text }))
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
      createSystemMessage({
        conversation,
        text: unknownError,
        id: reponseId,
        type: AIApiType.TRANSLATION,
        isError: true,
      })
    )
  }
}

const createSummarizer = async (
  setConversation: Dispatch<SetStateAction<Conversation>>
): Promise<SummarizationModelSession | undefined> => {
  try {
    const summarizer = await window.ai.summarizer.create()
    return summarizer
  } catch (_) {
    const couldNotCreateSummarizerText = i18n.t('errors.ai.couldNotCreateSummarizer')
    setConversation(conversation =>
      createSystemMessage({
        conversation,
        text: couldNotCreateSummarizerText,
        isError: true,
        type: AIApiType.SUMMARIZATION,
      })
    )
  }
}

export const getSummary = async (
  text: string,
  setConversation: Dispatch<SetStateAction<Conversation>>
): Promise<SummarizationModelSession | undefined> => {
  setConversation(conversation => createUserMessage({ conversation, text }))
  if (!window.ai) {
    const aiNotEnabledText = i18n.t('errors.ai.aiNotEnabled')
    setConversation(conversation =>
      createSystemMessage({
        conversation,
        text: aiNotEnabledText,
        isError: true,
        type: AIApiType.SUMMARIZATION,
      })
    )
    return
  }

  if (!window.ai.summarizer) {
    const summarizationNotEnabledText = i18n.t('errors.ai.summarizationNotEnabled')
    setConversation(conversation =>
      createSystemMessage({
        conversation,
        text: summarizationNotEnabledText,
        isError: true,
        type: AIApiType.SUMMARIZATION,
      })
    )
    return
  }
  const reponseId = window.crypto.randomUUID()

  const summarizer = await createSummarizer(setConversation)

  if (!summarizer) {
    return
  }

  try {
    const summary = await summarizer.summarize(text)

    setConversation(conversation =>
      createSystemMessage({ conversation, id: reponseId, text: summary, type: AIApiType.SUMMARIZATION })
    )

    return summarizer
  } catch (_) {
    const unknownError = i18n.t('errors.ai.unknownError')
    setConversation(conversation =>
      createSystemMessage({
        conversation,
        text: unknownError,
        id: reponseId,
        type: AIApiType.SUMMARIZATION,
        isError: true,
      })
    )
  }
}
