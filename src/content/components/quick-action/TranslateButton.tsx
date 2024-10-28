import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../../store'
import { QuickActionButton } from './QuickActionButton'
import { LanguagePairSelect } from './LanguagePairSelect'
import { getTranslation } from '../../utils/ai'
import { SupportedLanguages } from '../../types'

export const TranslateButton = () => {
  const { aiApiAvailability, setIsResponseLoading, areControlsDisabled } = useContentStore(
    useShallow(state => ({
      userInput: state.userInput,
      aiApiAvailability: state.aiApiAvailability,
      setIsResponseLoading: state.setIsResponseLoading,
      areControlsDisabled: state.areControlsDisabled,
    }))
  )
  const { t } = useTranslation()
  const translateText = t('buttons.translate')
  const [languagePair, setLanguagePair] = useState({
    sourceLanguage: SupportedLanguages.ENGLISH,
    targetLanguage: SupportedLanguages.SPANISH,
  })

  const handleGetResponse = async () => {
    setIsResponseLoading(true)
    await getTranslation(languagePair)
    setIsResponseLoading(false)
  }

  const isDisabled = areControlsDisabled() || !aiApiAvailability.translation.available

  return (
    <div className='flex grow gap-2'>
      <QuickActionButton disabled={isDisabled} onClick={handleGetResponse}>
        {translateText}
      </QuickActionButton>
      <LanguagePairSelect languagePair={languagePair} setLanguagePair={setLanguagePair} />
    </div>
  )
}
