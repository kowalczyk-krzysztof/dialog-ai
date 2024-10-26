import { type Dispatch, type SetStateAction, useState } from 'react'
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
import { useTranslation } from 'react-i18next'
import { QuickActionButton } from './QuickActionButton'
import { getTranslation, languageTagToHumanReadable } from '../../../utils/ai'
import { SupportedLanguages, type Conversation } from '../../../types/types'
import { DIALOG_TOOLTIP_Z_INDEX } from '../../../../constants'

interface Props {
  userInput: string
  disabled: boolean
  isResponseLoading: boolean
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
  setIsResponseLoading: Dispatch<SetStateAction<boolean>>
}

export const TranslateButton = ({
  userInput,
  disabled,
  isResponseLoading,
  setUserInput,
  setConversation,
  setIsResponseLoading,
}: Props) => {
  const { t } = useTranslation()
  const translateText = t('buttons.translate')
  const [sourceLanguage, setSourceLanguage] = useState(SupportedLanguages.ENGLISH)
  const [targetLanguage, setTargetLanguage] = useState(SupportedLanguages.SPANISH)

  const handleGetResponse = async () => {
    setUserInput('')
    setIsResponseLoading(true)
    await getTranslation(userInput, { sourceLanguage, targetLanguage }, setConversation)
    setIsResponseLoading(false)
  }

  const handleSelectSourceLanguage = (value: string) => {
    setSourceLanguage(value as SupportedLanguages)
  }

  const handleSelectTargetLanguage = (value: string) => {
    setTargetLanguage(value as SupportedLanguages)
  }

  const isDisabled = !userInput || isResponseLoading || disabled

  // TODO: Figure out UX for selecting language pair
  return (
    <div>
      <QuickActionButton disabled={isDisabled} onClick={handleGetResponse}>
        {translateText}
      </QuickActionButton>
      <SelectRoot defaultValue={sourceLanguage} onValueChange={handleSelectSourceLanguage}>
        <SelectTrigger
          aria-label='source language'
          className='inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-slate-500 px-[15px] py-0 text-[13px] leading-none text-slate-200 shadow-[0_2px_10px_var(--black-a7)]'
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
      <SelectRoot defaultValue={targetLanguage} onValueChange={handleSelectTargetLanguage}>
        <SelectTrigger
          aria-label='source language'
          className='inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-slate-500 px-[15px] py-0 text-[13px] leading-none text-slate-200 shadow-[0_2px_10px_var(--black-a7)]'
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
    </div>
  )
}
