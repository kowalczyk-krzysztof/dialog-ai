import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../../../../store'
import { Button } from '../../../../../shared/components/Button'
import { getSummary } from '../../../../api/summarization'

export const SummarizationButton = () => {
  const { t } = useTranslation()
  const { aiApiAvailability, setIsResponseLoading, areControlsDisabled } = useContentStore(
    useShallow(state => ({
      userInput: state.userInput,
      aiApiAvailability: state.aiApiAvailability,
      setIsResponseLoading: state.setIsResponseLoading,
      areControlsDisabled: state.areControlsDisabled,
    }))
  )

  const isDisabled = areControlsDisabled() || !aiApiAvailability.summarization

  const summarizeText = t('buttons.summarize')

  const handleGetResponse = async () => {
    setIsResponseLoading(true)
    await getSummary()
    setIsResponseLoading(false)
  }

  return (
    <Button disabled={isDisabled} onClick={handleGetResponse}>
      {summarizeText}
    </Button>
  )
}
