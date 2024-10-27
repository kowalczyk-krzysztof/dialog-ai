import { useTranslation } from 'react-i18next'
import { QuickActionButton } from './QuickActionButton'
import { getSummary } from '../../utils/ai'
import { useContentStore } from '../../store'
import { useShallow } from 'zustand/react/shallow'

export const SummarizeButton = () => {
  const { aiApiAvailability, setIsResponseLoading, areControlsDisabled } = useContentStore(
    useShallow(state => ({
      userInput: state.userInput,
      aiApiAvailability: state.aiApiAvailability,
      setIsResponseLoading: state.setIsResponseLoading,
      areControlsDisabled: state.areControlsDisabled,
    }))
  )
  const { t } = useTranslation()
  const summarizeText = t('buttons.summarize')

  const handleGetResponse = async () => {
    setIsResponseLoading(true)
    await getSummary()
    setIsResponseLoading(false)
  }

  const isDisabled = areControlsDisabled() || !aiApiAvailability.summarization.available

  return (
    <QuickActionButton disabled={isDisabled} onClick={handleGetResponse}>
      {summarizeText}
    </QuickActionButton>
  )
}
