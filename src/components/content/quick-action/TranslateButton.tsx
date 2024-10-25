import { type Dispatch, type SetStateAction, useState } from 'react'
import * as Select from '@radix-ui/react-select'
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
        {t('buttons.translate')}
      </QuickActionButton>
      <Select.Root defaultValue={sourceLanguage} onValueChange={handleSelectSourceLanguage}>
        <Select.Trigger
          aria-label='source language'
          className='inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-slate-500 px-[15px] py-0 text-[13px] leading-none text-slate-200 shadow-[0_2px_10px_var(--black-a7)]'
        >
          <Select.Value />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            style={{
              zIndex: DIALOG_TOOLTIP_Z_INDEX,
            }}
          >
            <Select.Viewport className='bg-slate-500'>
              {Object.values(SupportedLanguages).map(language => (
                <Select.Item
                  key={language}
                  value={language}
                  className='relative flex h-[25px] select-none items-center rounded-[3px] py-0 pl-[25px] pr-[35px] text-[13px] leading-none text-slate-200'
                >
                  <Select.ItemText>{languageTagToHumanReadable(language)}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <Select.Root defaultValue={targetLanguage} onValueChange={handleSelectTargetLanguage}>
        <Select.Trigger
          aria-label='source language'
          className='inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-slate-500 px-[15px] py-0 text-[13px] leading-none text-slate-200 shadow-[0_2px_10px_var(--black-a7)]'
        >
          <Select.Value />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            style={{
              zIndex: DIALOG_TOOLTIP_Z_INDEX,
            }}
          >
            <Select.Viewport className='bg-slate-500'>
              {Object.values(SupportedLanguages).map(language => (
                <Select.Item
                  key={language}
                  value={language}
                  className='relative flex h-[25px] select-none items-center rounded-[3px] py-0 pl-[25px] pr-[35px] text-[13px] leading-none text-slate-200'
                >
                  <Select.ItemText>{languageTagToHumanReadable(language)}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  )
}
