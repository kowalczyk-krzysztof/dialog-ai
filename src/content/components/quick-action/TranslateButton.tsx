import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../../store'
import { QuickActionButton } from './QuickActionButton'
import { LanguagePairSelect } from './LanguagePairSelect'
import { getTranslation } from '../../utils/ai'

export const TranslateButton = () => {
  const { aiApiAvailability, sourceLanguage, targetLanguage, setIsResponseLoading, areControlsDisabled } =
    useContentStore(
      useShallow(state => ({
        userInput: state.userInput,
        aiApiAvailability: state.aiApiAvailability,
        sourceLanguage: state.trasnlationSourceLanguage,
        targetLanguage: state.trasnlationTargetLanguage,
        setIsResponseLoading: state.setIsResponseLoading,
        areControlsDisabled: state.areControlsDisabled,
      }))
    )
  const { t } = useTranslation()
  const translateText = t('buttons.translate')

  const handleGetResponse = async () => {
    setIsResponseLoading(true)
    await getTranslation({ sourceLanguage, targetLanguage })
    setIsResponseLoading(false)
  }

  const isDisabled = areControlsDisabled() || !aiApiAvailability.translation.available

  return (
    <div className='flex grow gap-2'>
      <QuickActionButton disabled={isDisabled} onClick={handleGetResponse}>
        {translateText}
      </QuickActionButton>
      <LanguagePairSelect />
    </div>
  )
}
