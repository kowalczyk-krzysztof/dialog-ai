import { useState, type Dispatch, type SetStateAction } from 'react'
import {
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectPortal,
  Root as SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from '@radix-ui/react-select'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { SupportedLanguages, type TranslationLanguagePair } from '../../../types/types'
import { DIALOG_TOOLTIP_Z_INDEX } from '../../../../constants'
import { languageTagToHumanReadable } from '../../../utils/ai'
import Swap from '../../icons/swap.svg?react'

interface Props {
  languagePair: TranslationLanguagePair
  setLanguagePair: Dispatch<SetStateAction<TranslationLanguagePair>>
}

export const LanguagePairSelect = ({ languagePair, setLanguagePair }: Props) => {
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

  return (
    <>
      <SelectRoot
        value={languagePair.sourceLanguage}
        onValueChange={handleSelectSourceLanguage}
        disabled={languagePair.sourceLanguage === SupportedLanguages.ENGLISH}
      >
        <SelectTrigger
          aria-label='source language'
          className='inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-blue-600 px-[15px] py-0 text-[13px] leading-none text-slate-200 shadow-[0_2px_10px_var(--black-a7)] disabled:cursor-not-allowed disabled:bg-neutral-400'
        >
          <SelectValue />
        </SelectTrigger>
        <SelectPortal>
          <SelectContent
            style={{
              zIndex: DIALOG_TOOLTIP_Z_INDEX,
            }}
          >
            <SelectViewport className='bg-slate-500'>
              {Object.values(SupportedLanguages).map(language => (
                <SelectItem
                  key={language}
                  value={language}
                  className='relative flex h-[25px] select-none items-center rounded-[3px] py-0 pl-[25px] pr-[35px] text-[13px] leading-none text-slate-200'
                >
                  <SelectItemText>{languageTagToHumanReadable(language)}</SelectItemText>
                </SelectItem>
              ))}
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
      <button
        onClick={handleSwapLanguages}
        className='group inline-flex cursor-pointer justify-center rounded-full p-2 disabled:cursor-not-allowed'
      >
        <AccessibleIcon label={'swap'}>
          <Swap className='size-5 fill-blue-600 hover:fill-blue-400 group-disabled:fill-neutral-400' />
        </AccessibleIcon>
      </button>
      <SelectRoot
        value={languagePair.targetLanguage}
        onValueChange={handleSelectTargetLanguage}
        disabled={languagePair.targetLanguage === SupportedLanguages.ENGLISH}
      >
        <SelectTrigger
          aria-label='source language'
          className='inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-blue-600 px-[15px] py-0 text-[13px] leading-none text-slate-200 shadow-[0_2px_10px_var(--black-a7)] disabled:cursor-not-allowed disabled:bg-neutral-400'
        >
          <SelectValue />
        </SelectTrigger>
        <SelectPortal>
          <SelectContent
            style={{
              zIndex: DIALOG_TOOLTIP_Z_INDEX,
            }}
          >
            <SelectViewport className='bg-slate-500'>
              {Object.values(SupportedLanguages).map(language => (
                <SelectItem
                  key={language}
                  value={language}
                  className='relative flex h-[25px] select-none items-center rounded-[3px] py-0 pl-[25px] pr-[35px] text-[13px] leading-none text-slate-200'
                >
                  <SelectItemText>{languageTagToHumanReadable(language)}</SelectItemText>
                </SelectItem>
              ))}
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
    </>
  )
}
