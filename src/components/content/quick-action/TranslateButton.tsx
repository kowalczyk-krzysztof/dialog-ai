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
import { LanguagePairSelect } from './LanguagePairSelect'

interface Props {
  userInput: string
  disabled: boolean
  isResponseLoading: boolean
  isStreamingResponse: boolean
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
  setIsResponseLoading: Dispatch<SetStateAction<boolean>>
}

export const TranslateButton = ({
  userInput,
  disabled,
  isResponseLoading,
  isStreamingResponse,
  setUserInput,
  setConversation,
  setIsResponseLoading,
}: Props) => {
  const { t } = useTranslation()
  const translateText = t('buttons.translate')
  const [languagePair, setLanguagePair] = useState({
    sourceLanguage: SupportedLanguages.ENGLISH,
    targetLanguage: SupportedLanguages.SPANISH,
  })

  const handleGetResponse = async () => {
    setUserInput('')
    setIsResponseLoading(true)
    await getTranslation(userInput, languagePair, setConversation)
    setIsResponseLoading(false)
  }

  const isDisabled = !userInput || isResponseLoading || disabled || isStreamingResponse

  // TODO: Figure out UX for selecting language pair
  return (
    <div>
      <QuickActionButton disabled={isDisabled} onClick={handleGetResponse}>
        {translateText}
      </QuickActionButton>
      <LanguagePairSelect languagePair={languagePair} setLanguagePair={setLanguagePair} />
    </div>
  )
}
