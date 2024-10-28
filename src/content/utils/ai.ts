import {
  type AIApiAvailability,
  type Conversation,
  type ChatSession,
  type SummarizationSession,
  type TranslationLanguagePair,
  AIApiAvailabilityString,
  AIApiType,
  MessageRole,
  SupportedLanguages,
  TranslationModelSession,
} from '../../content/types'
import { useContentStore } from '../store'
import i18n from '../../i118n'

export const languageTagToHumanReadable = (
  languageTag: SupportedLanguages,
  targetLanguage: SupportedLanguages = SupportedLanguages.ENGLISH
) => {
  const displayNames = new Intl.DisplayNames([targetLanguage], {
    type: 'language',
  })
  return displayNames.of(languageTag) ?? languageTag
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

export const checkAiApiAvailability = async (): Promise<AIApiAvailability> => {
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

const createChatSession = async (): Promise<ChatSession | undefined> => {
  const { setConversation } = useContentStore.getState()
  try {
    const session = await window.ai.languageModel.create()
    return session
  } catch (e) {
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

const getChatResponse = async (chatSession: ChatSession) => {
  const {
    setConversation,
    userInput,
    setIsStreamingResponse,
    setIsResponseLoading,
    setChatSession,
    setUserInput,
    setChatResponseAbortController,
  } = useContentStore.getState()
  try {
    const abortController = new AbortController()
    const storedUserInput = userInput
    setUserInput('')
    const stream = await chatSession.promptStreaming(storedUserInput, { signal: abortController.signal })
    setChatResponseAbortController(abortController)
    const reponseId = window.crypto.randomUUID()
    for await (const chunk of stream) {
      setIsResponseLoading(false)
      setIsStreamingResponse(true)
      setConversation(conversation =>
        createSystemMessage({ conversation, text: chunk.trim(), id: reponseId, type: AIApiType.CHAT })
      )
    }
    setChatSession(chatSession)
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      return
    }
    const unknownError = i18n.t('errors.ai.unknownError')
    setConversation(conversation =>
      createSystemMessage({ conversation, text: unknownError, type: AIApiType.CHAT, isError: true })
    )
    setChatSession(undefined)
  } finally {
    setIsStreamingResponse(false)
    setChatResponseAbortController(undefined)
  }
}

export const getChatStreamingResponse = async () => {
  const { setConversation, userInput, chatSession } = useContentStore.getState()
  setConversation(conversation => createUserMessage({ conversation, text: userInput }))
  if (chatSession) {
    await getChatResponse(chatSession)
    return
  }

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

  const session = await createChatSession()

  if (!session) {
    return
  }

  await getChatResponse(session)
}

const createTranslator = async (
  languagePair: TranslationLanguagePair
): Promise<TranslationModelSession | undefined> => {
  const { setConversation } = useContentStore.getState()
  try {
    const translator = await window.translation.createTranslator(languagePair)
    return translator
  } catch (e) {
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

export const getTranslation = async (languagePair: TranslationLanguagePair) => {
  const { setConversation, userInput, setUserInput, setTranslationResponseAbortController } = useContentStore.getState()
  const storedUserInput = userInput
  setUserInput('')
  setConversation(conversation => createUserMessage({ conversation, text: storedUserInput }))
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

  const translator = await createTranslator(languagePair)

  if (!translator) {
    return
  }

  try {
    const controller = new AbortController()
    const translation = await translator.translate(storedUserInput, { signal: controller.signal })
    setTranslationResponseAbortController(controller)
    setConversation(conversation =>
      createSystemMessage({ conversation, text: translation, id: reponseId, type: AIApiType.TRANSLATION })
    )
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      return
    }
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
  } finally {
    setTranslationResponseAbortController(undefined)
  }
}

const createSummarizer = async (): Promise<SummarizationSession | undefined> => {
  const { setConversation } = useContentStore.getState()
  try {
    const summarizer = await window.ai.summarizer.create()
    return summarizer
  } catch (e) {
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

const getSummarizationResponse = async (summarizer: SummarizationSession) => {
  const { setConversation, userInput, setSummarizationSession, setUserInput, setSummarizationResponseAbortController } =
    useContentStore.getState()
  const reponseId = window.crypto.randomUUID()

  try {
    const storedUserInput = userInput
    const abortController = new AbortController()
    setUserInput('')
    const summary = await summarizer.summarize(storedUserInput, { signal: abortController.signal })
    setSummarizationResponseAbortController(abortController)

    setConversation(conversation =>
      createSystemMessage({ conversation, id: reponseId, text: summary, type: AIApiType.SUMMARIZATION })
    )

    setSummarizationSession(summarizer)
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      return
    }
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
    setSummarizationSession(undefined)
  } finally {
    setSummarizationResponseAbortController(undefined)
  }
}

export const getSummary = async () => {
  const { setConversation, userInput, summarizationSession } = useContentStore.getState()
  setConversation(conversation => createUserMessage({ conversation, text: userInput }))
  if (summarizationSession) {
    await getSummarizationResponse(summarizationSession)
    return
  }

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

  const summarizer = await createSummarizer()

  if (!summarizer) {
    return
  }

  await getSummarizationResponse(summarizer)
}
