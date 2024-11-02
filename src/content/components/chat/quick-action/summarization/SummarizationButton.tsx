import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../../../../store'
import { Button } from '../../../../../shared/components/Button'
import { getSummary } from '../../../../api/summarization'

export const SummarizationButton = () => {
  const { t } = useTranslation()
  const { isDisabled, setIsResponseLoading } = useContentStore(
    useShallow(state => ({
      isDisabled: state.areControlsDisabled() || !state.aiApiAvailability.summarization,
      setIsResponseLoading: state.setIsResponseLoading,
    }))
  )

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
