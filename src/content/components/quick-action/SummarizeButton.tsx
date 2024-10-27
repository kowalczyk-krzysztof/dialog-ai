import { useTranslation } from 'react-i18next'
import { QuickActionButton } from './QuickActionButton'
import { getSummary } from '../../utils/ai'
import { useContentStore } from '../../store'
import { useShallow } from 'zustand/react/shallow'

export const SummarizeButton = () => {
  const { userInput, aiApiAvailability, isStreamingResponse, isResponseLoading, setIsResponseLoading } =
    useContentStore(
      useShallow(state => ({
        userInput: state.userInput,
        aiApiAvailability: state.aiApiAvailability,
        isStreamingResponse: state.isStreamingResponse,
        isResponseLoading: state.isResponseLoading,
        setIsResponseLoading: state.setIsResponseLoading,
      }))
    )
  const { t } = useTranslation()
  const summarizeText = t('buttons.summarize')

  const handleGetResponse = async () => {
    setIsResponseLoading(true)
    await getSummary()
    setIsResponseLoading(false)
  }

  const isDisabled =
    !userInput || isResponseLoading || !aiApiAvailability.summarization.available || isStreamingResponse

  return (
    <QuickActionButton disabled={isDisabled} onClick={handleGetResponse}>
      {summarizeText}
    </QuickActionButton>
  )
}
