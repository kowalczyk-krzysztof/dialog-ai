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
  const {
    settings: { sourceLanguage, targetLanguage },
    isDisabled,
    setIsResponseLoading,
  } = useContentStore(
    useShallow(state => ({
      settings: state.settings,
      isDisabled: state.areControlsDisabled() || !state.aiApiAvailability.translation,
      setIsResponseLoading: state.setIsResponseLoading,
    }))
  )
  const [languagePair, setLanguagePair] = useState<TranslationLanguagePair>({
    sourceLanguage,
    targetLanguage,
  })

  useEffect(() => {
    setLanguagePair({ sourceLanguage, targetLanguage })
  }, [sourceLanguage, targetLanguage])

  const translateText = t('buttons.translate')

  const handleGetResponse = async () => {
    setIsResponseLoading(true)
    await getTranslation(languagePair)
    setIsResponseLoading(false)
  }

  return (
    <div className='flex rounded-lg border border-border bg-tertiary px-2 py-1.5'>
      <Button className='mr-2' disabled={isDisabled} onClick={handleGetResponse}>
        {translateText}
      </Button>
      <LanguagePairSelect languagePair={languagePair} setLanguagePair={setLanguagePair} />
    </div>
  )
}
