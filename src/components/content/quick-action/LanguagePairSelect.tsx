import { type Dispatch, type SetStateAction } from 'react'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { SupportedLanguages, type TranslationLanguagePair } from '../../../types/types'
import { languageTagToHumanReadable } from '../../../utils/ai'
import Swap from '../../icons/swap.svg?react'
import { Select } from '../../shared/Select'
import { useTranslation } from 'react-i18next'

interface Props {
  languagePair: TranslationLanguagePair
  setLanguagePair: Dispatch<SetStateAction<TranslationLanguagePair>>
}

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
    <>
      <Select
        disabled={isDisabled(languagePair.sourceLanguage)}
        items={sourceLanguageItems}
        value={sourceLanguageItem}
        onChange={handleSelectSourceLanguage}
      />
      <button
        onClick={handleSwapLanguages}
        className='group inline-flex cursor-pointer justify-center rounded-full p-2 disabled:cursor-not-allowed'
      >
        <AccessibleIcon label={swapLanguagesText}>
          <Swap className='size-5 fill-blue-600 hover:fill-blue-400 group-disabled:fill-neutral-400' />
        </AccessibleIcon>
      </button>
      <Select
        disabled={isDisabled(languagePair.targetLanguage)}
        items={targetLanguageItems}
        value={targetLanguageItem}
        onChange={handleSelectTargetLanguage}
      />
    </>
  )
}
