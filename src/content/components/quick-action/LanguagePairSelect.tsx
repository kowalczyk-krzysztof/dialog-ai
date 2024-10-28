import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../../store'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { Select } from '../../../shared/components/Select'
import { LanguagePairLabel } from './LanguagePairLabel'
import { languageTagToHumanReadable } from '../../utils/ai'
import { SupportedLanguages } from '../../types'
import Swap from '../../icons/swap.svg?react'

export const LanguagePairSelect = () => {
  const { t } = useTranslation()
  const { sourceLanguage, targetLanguage, setTranslationSourceLanguage, setTranslationTargetLanguage } =
    useContentStore(
      useShallow(state => ({
        sourceLanguage: state.trasnlationSourceLanguage,
        targetLanguage: state.trasnlationTargetLanguage,
        setTranslationSourceLanguage: state.setTranslationSourceLanguage,
        setTranslationTargetLanguage: state.setTranslationTargetLanguage,
      }))
    )
  const swapLanguagesText = t('buttons.swapLanguages')
  const fromLabel = t('from')
  const toLabel = t('to')

  const handleSelectSourceLanguage = (value: string) => {
    setTranslationSourceLanguage(value as SupportedLanguages)
  }

  const handleSelectTargetLanguage = (value: string) => {
    setTranslationTargetLanguage(value as SupportedLanguages)
  }

  const handleSwapLanguages = () => {
    const storedTargetLanguage = targetLanguage
    const storedSourceLanguage = sourceLanguage
    setTranslationSourceLanguage(storedTargetLanguage)
    setTranslationTargetLanguage(storedSourceLanguage)
  }

  const sourceLanguageItems = Object.values(SupportedLanguages).map(language => ({
    key: language,
    value: language,
    label: languageTagToHumanReadable(language),
  }))

  const targetLanguageItems = Object.values(SupportedLanguages).map(language => ({
    key: language,
    value: language,
    label: languageTagToHumanReadable(language),
  }))

  const sourceLanguageItem = {
    key: sourceLanguage,
    value: sourceLanguage,
    label: languageTagToHumanReadable(sourceLanguage),
  }

  const targetLanguageItem = {
    key: targetLanguage,
    value: targetLanguage,
    label: languageTagToHumanReadable(targetLanguage),
  }

  const sourceId = 'source-language'
  const targetId = 'target-language'

  const isDisabled = (value: SupportedLanguages) => value === SupportedLanguages.ENGLISH

  return (
    <div className='flex bg-tertiary px-2 rounded-lg border border-border'>
      <div className='flex items-end relative pb-1'>
        <LanguagePairLabel id={sourceId} text={fromLabel} />
        <Select
          disabled={isDisabled(sourceLanguage)}
          items={sourceLanguageItems}
          value={sourceLanguageItem}
          id={sourceId}
          onChange={handleSelectSourceLanguage}
        />
      </div>
      <div className='flex items-end'>
        <button
          className='flex justify-center items-end mx-2 px-2 pb-1 group'
          onClick={handleSwapLanguages}
          title={swapLanguagesText}
        >
          <AccessibleIcon label={swapLanguagesText}>
            <Swap className='size-4 fill-primary group-hover:fill-primary-hover' />
          </AccessibleIcon>
        </button>
      </div>
      <div className='flex items-end relative pb-1'>
        <LanguagePairLabel id={targetId} text={toLabel} />
        <Select
          disabled={isDisabled(targetLanguage)}
          items={targetLanguageItems}
          value={targetLanguageItem}
          id={targetId}
          onChange={handleSelectTargetLanguage}
        />
      </div>
    </div>
  )
}
