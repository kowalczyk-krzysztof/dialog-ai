import type { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { Select } from '../../../shared/components/Select'
import { languageTagToHumanReadable } from '../../utils/ai'
import Swap from '../../icons/swap.svg?react'
import { type TranslationLanguagePair, SupportedLanguages } from '../../types'
import { LanguagePairLabel } from './LanguagePairLabel'

interface Props {
  languagePair: TranslationLanguagePair
  setLanguagePair: Dispatch<SetStateAction<TranslationLanguagePair>>
}

// TODO: Style this better
export const LanguagePairSelect = ({ languagePair, setLanguagePair }: Props) => {
  const { t } = useTranslation()
  const swapLanguagesText = t('buttons.swapLanguages')
  const fromLabel = t('from')
  const toLabel = t('to')

  const handleSelectSourceLanguage = (value: string) => {
    setLanguagePair(languagePair => ({
      ...languagePair,
      sourceLanguage: value as SupportedLanguages,
    }))
  }

  const handleSelectTargetLanguage = (value: string) => {
    setLanguagePair(languagePair => ({
      ...languagePair,
      targetLanguage: value as SupportedLanguages,
    }))
  }

  const handleSwapLanguages = () => {
    setLanguagePair(languagePair => ({
      sourceLanguage: languagePair.targetLanguage,
      targetLanguage: languagePair.sourceLanguage,
    }))
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
    key: languagePair.sourceLanguage,
    value: languagePair.sourceLanguage,
    label: languageTagToHumanReadable(languagePair.sourceLanguage),
  }

  const targetLanguageItem = {
    key: languagePair.targetLanguage,
    value: languagePair.targetLanguage,
    label: languageTagToHumanReadable(languagePair.targetLanguage),
  }

  const sourceId = 'source-language'
  const targetId = 'target-language'

  const isDisabled = (value: SupportedLanguages) => value === SupportedLanguages.ENGLISH

  return (
    <div className='flex bg-tertiary px-2 rounded-lg border border-border'>
      <div className='flex items-end relative pb-1'>
        <LanguagePairLabel id={sourceId} text={fromLabel} />
        <Select
          disabled={isDisabled(languagePair.sourceLanguage)}
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
          disabled={isDisabled(languagePair.targetLanguage)}
          items={targetLanguageItems}
          value={targetLanguageItem}
          id={targetId}
          onChange={handleSelectTargetLanguage}
        />
      </div>
    </div>
  )
}
