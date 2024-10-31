import { type Dispatch, type SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../../../../store'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { Select } from '../../../../../shared/components/Select'
import { LanguagePairLabel } from './LanguagePairLabel'
import { getLanguageItems, mapLanguageToSelectOption } from '../../../../utils/ai'
import { SupportedLanguages, TranslationLanguagePair } from '../../../../types'
import Swap from '../../../../../shared/icons/swap.svg?react'

interface Props {
  languagePair: TranslationLanguagePair
  setLanguagePair: Dispatch<SetStateAction<TranslationLanguagePair>>
}

// TODO: Loading state when fetching settings
export const LanguagePairSelect = ({ languagePair, setLanguagePair }: Props) => {
  const { t } = useTranslation()

  const swapLanguagesText = t('buttons.swapLanguages')
  const fromLabel = t('from')
  const toLabel = t('to')

  const handleSelectSourceLanguage = (value: string) => {
    setLanguagePair(pair => ({
      ...pair,
      sourceLanguage: value as SupportedLanguages,
    }))
  }

  const handleSelectTargetLanguage = (value: string) => {
    setLanguagePair(pair => ({
      ...pair,
      targetLanguage: value as SupportedLanguages,
    }))
  }

  const handleSwapLanguages = () => {
    setLanguagePair(pair => ({
      sourceLanguage: pair.targetLanguage,
      targetLanguage: pair.sourceLanguage,
    }))
  }

  const isDisabled = (value: SupportedLanguages) => value === SupportedLanguages.ENGLISH
  const isSourceDisabled = isDisabled(languagePair.sourceLanguage)
  const isTargetDisabled = isDisabled(languagePair.targetLanguage)

  const sourceLanguageItems = getLanguageItems(isTargetDisabled)

  const targetLanguageItems = getLanguageItems(isSourceDisabled)

  const sourceLanguageItem = mapLanguageToSelectOption(languagePair.sourceLanguage)
  const targetLanguageItem = mapLanguageToSelectOption(languagePair.targetLanguage)

  const sourceId = 'source-language'
  const targetId = 'target-language'

  return (
    <>
      <div className='flex items-end relative'>
        <LanguagePairLabel id={sourceId} text={fromLabel} />
        <Select
          disabled={isSourceDisabled}
          items={sourceLanguageItems}
          value={sourceLanguageItem}
          id={sourceId}
          onChange={handleSelectSourceLanguage}
        />
      </div>
      <div className='flex items-end'>
        <button
          className='flex justify-center items-end mx-2 group'
          onClick={handleSwapLanguages}
          title={swapLanguagesText}
        >
          <AccessibleIcon label={swapLanguagesText}>
            <Swap className='size-4 fill-primary group-hover:fill-primary-hover' />
          </AccessibleIcon>
        </button>
      </div>
      <div className='flex items-end relative'>
        <LanguagePairLabel id={targetId} text={toLabel} />
        <Select
          disabled={isTargetDisabled}
          items={targetLanguageItems}
          value={targetLanguageItem}
          id={targetId}
          onChange={handleSelectTargetLanguage}
        />
      </div>
    </>
  )
}
