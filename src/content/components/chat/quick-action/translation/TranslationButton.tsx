import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../../../../store'
import { Button } from '../../../../../shared/components/Button'
import { LanguagePairSelect } from './LanguagePairSelect'
import { getTranslation } from '../../../../api/translation'
import type { TranslationLanguagePair } from '../../../../types'

export const TranslationButton = () => {
  const { t } = useTranslation()
  const { settings, aiApiAvailability, setIsResponseLoading, areControlsDisabled } = useContentStore(
    useShallow(state => ({
      userInput: state.userInput,
      settings: state.settings,
      aiApiAvailability: state.aiApiAvailability,
      setIsResponseLoading: state.setIsResponseLoading,
      areControlsDisabled: state.areControlsDisabled,
    }))
  )
  const [languagePair, setLanguagePair] = useState<TranslationLanguagePair>({
    sourceLanguage: settings.sourceLanguage,
    targetLanguage: settings.targetLanguage,
  })

  useEffect(() => {
    setLanguagePair({ sourceLanguage: settings.sourceLanguage, targetLanguage: settings.targetLanguage })
  }, [settings])

  const translateText = t('buttons.translate')

  const handleGetResponse = async () => {
    setIsResponseLoading(true)
    await getTranslation(languagePair)
    setIsResponseLoading(false)
  }

  const isDisabled = areControlsDisabled() || !aiApiAvailability.translation.available

  return (
    <div className='flex bg-tertiary px-2 rounded-lg border border-border py-1.5'>
      <Button disabled={isDisabled} onClick={handleGetResponse} className='mr-2'>
        {translateText}
      </Button>
      <LanguagePairSelect languagePair={languagePair} setLanguagePair={setLanguagePair} />
    </div>
  )
}