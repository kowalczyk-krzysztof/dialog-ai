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
