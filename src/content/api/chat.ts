import { useContentStore } from '../store'
import i18n from '../../i118n'
import { createSystemMessage, createUserMessage } from '../utils/ai'
import { type ChatSession, AIApiType } from '../types'

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
    userInput,
    setConversation,
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
    const text = e instanceof Error ? e?.message : unknownError
    setConversation(conversation => createSystemMessage({ conversation, text, type: AIApiType.CHAT, isError: true }))
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
        type: AIApiType.CHAT,
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
