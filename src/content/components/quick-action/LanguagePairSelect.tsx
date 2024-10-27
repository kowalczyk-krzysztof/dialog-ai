import { type Dispatch, type SetStateAction } from 'react'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { SupportedLanguages, type TranslationLanguagePair } from '../../types'

import Swap from '../../icons/swap.svg?react'

import { useTranslation } from 'react-i18next'
import { languageTagToHumanReadable } from '../../utils/ai'
import { Select } from '../../../shared/components/Select'

interface Props {
  languagePair: TranslationLanguagePair
  setLanguagePair: Dispatch<SetStateAction<TranslationLanguagePair>>
}

// TODO: Style this better
export const LanguagePairSelect = ({ languagePair, setLanguagePair }: Props) => {
  const { t } = useTranslation()
  const swapLanguagesText = t('swapLanguages')

  const handleSelectSourceLanguage = (value: string) => {
    setLanguagePair(languagePair => ({
      ...languagePair,
      sourceLanguageLanguage: value as SupportedLanguages,
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

  const isDisabled = (value: SupportedLanguages) => value === SupportedLanguages.ENGLISH

  return (
    <div className='flex'>
      <Select
        disabled={isDisabled(languagePair.sourceLanguage)}
        items={sourceLanguageItems}
        value={sourceLanguageItem}
        onChange={handleSelectSourceLanguage}
      />
      <button className='flex justify-center items-center mx-2' onClick={handleSwapLanguages}>
        <AccessibleIcon label={swapLanguagesText}>
          <Swap className='size-4 fill-primary hover:fill-primary-hover' />
        </AccessibleIcon>
      </button>
      <Select
        disabled={isDisabled(languagePair.targetLanguage)}
        items={targetLanguageItems}
        value={targetLanguageItem}
        onChange={handleSelectTargetLanguage}
      />
    </div>
  )
}
