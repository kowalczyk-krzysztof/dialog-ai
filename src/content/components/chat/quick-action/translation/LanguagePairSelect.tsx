import type { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { Select } from '../../../../../shared/components/Select'
import { LanguagePairLabel } from './LanguagePairLabel'
import { getLanguageItems, mapLanguageToSelectOption } from '../../../../utils/translation'
import { SupportedLanguages, TranslationLanguagePair } from '../../../../types'
import Swap from '../../../../../shared/icons/swap.svg?react'

interface Props {
  languagePair: TranslationLanguagePair
  setLanguagePair: Dispatch<SetStateAction<TranslationLanguagePair>>
}

export const LanguagePairSelect = ({ languagePair, setLanguagePair }: Props) => {
  const { t } = useTranslation()

  const swapLanguagesText = t('buttons.swapLanguages')
  const fromLabel = t('from')
  const toLabel = t('to')

  const sourceId = 'quick-action-source-language'
  const targetId = 'quick-action-target-language'

  const handleSelectSourceLanguage = (value: string) => {
    setLanguagePair(pair => ({
      ...pair,
      sourceLanguage: value as SupportedLanguages,
    }))
  }

  const handleSelectTargetLanguage = (value: string) => {
    setLanguagePair(pair => ({ ...pair, targetLanguage: value as SupportedLanguages }))
  }

  const handleSwapLanguages = () => {
    setLanguagePair(pair => ({
      sourceLanguage: pair.targetLanguage,
      targetLanguage: pair.sourceLanguage,
    }))
  }

  const sourceLanguageItems = getLanguageItems().map(item => ({
    ...item,
    disabled: item.value === languagePair.targetLanguage,
  }))
  const targetLanguageItems = getLanguageItems().map(item => ({
    ...item,
    disabled: item.value === languagePair.sourceLanguage,
  }))

  const sourceLanguageItem = mapLanguageToSelectOption(languagePair.sourceLanguage)
  const targetLanguageItem = mapLanguageToSelectOption(languagePair.targetLanguage)

  return (
    <>
      <div className='relative flex items-end'>
        <LanguagePairLabel id={sourceId} text={fromLabel} />
        <Select
          items={sourceLanguageItems}
          value={sourceLanguageItem}
          id={sourceId}
          onChange={handleSelectSourceLanguage}
        />
      </div>
      <button
        className='group mx-2 flex h-fit self-end p-1 hover:bg-tertiary-hover'
        title={swapLanguagesText}
        onClick={handleSwapLanguages}
      >
        <AccessibleIcon label={swapLanguagesText}>
          <Swap className='size-4 fill-primary group-hover:fill-primary-hover' />
        </AccessibleIcon>
      </button>
      <div className='relative flex items-end'>
        <LanguagePairLabel id={targetId} text={toLabel} />
        <Select
          items={targetLanguageItems}
          value={targetLanguageItem}
          id={targetId}
          onChange={handleSelectTargetLanguage}
        />
      </div>
    </>
  )
}
