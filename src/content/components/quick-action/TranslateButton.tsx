import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QuickActionButton } from './QuickActionButton'
import { SupportedLanguages } from '../../types'
import { LanguagePairSelect } from './LanguagePairSelect'
import { getTranslation } from '../../utils/ai'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../../store'

export const TranslateButton = () => {
  const { aiApiAvailability, userInput, isStreamingResponse, isResponseLoading, setIsResponseLoading } =
    useContentStore(
      useShallow(state => ({
        aiApiAvailability: state.aiApiAvailability,
        userInput: state.userInput,
        isStreamingResponse: state.isStreamingResponse,
        isResponseLoading: state.isResponseLoading,
        setIsResponseLoading: state.setIsResponseLoading,
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

  const isDisabled = !userInput || isResponseLoading || !aiApiAvailability.translation.available || isStreamingResponse

  return (
    <div>
      <QuickActionButton disabled={isDisabled} onClick={handleGetResponse}>
        {translateText}
      </QuickActionButton>
      <LanguagePairSelect languagePair={languagePair} setLanguagePair={setLanguagePair} />
    </div>
  )
}
