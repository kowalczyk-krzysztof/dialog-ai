import { useContentStore } from '../store'
import i18n from '../../i118n'
import { createSystemMessage, createUserMessage } from '../utils/ai'
import { type SummarizationSession, AIApiType } from '../types'

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
  const {
    userInput,
    setConversation,
    setSummarizationSession,
    setUserInput,
    setSummarizationResponseAbortController,
    setIsResponseLoading,
    setIsStreamingResponse,
  } = useContentStore.getState()

  try {
    const abortController = new AbortController()
    const storedUserInput = userInput
    setUserInput('')
    const stream = await summarizer.summarizeStreaming(storedUserInput, { signal: abortController.signal })
    setSummarizationResponseAbortController(abortController)
    const reponseId = window.crypto.randomUUID()
    for await (const chunk of stream) {
      setIsResponseLoading(false)
      setIsStreamingResponse(true)
      setConversation(conversation =>
        createSystemMessage({ conversation, text: chunk.trim(), id: reponseId, type: AIApiType.SUMMARIZATION })
      )
    }
    setSummarizationSession(summarizer)
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      return
    }
    const unknownError = i18n.t('errors.ai.unknownError')
    setConversation(conversation =>
      createSystemMessage({ conversation, text: unknownError, type: AIApiType.SUMMARIZATION, isError: true })
    )
    setSummarizationSession(undefined)
  } finally {
    setIsStreamingResponse(false)
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
