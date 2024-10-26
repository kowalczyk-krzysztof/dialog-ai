import { type Dispatch, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { QuickActionButton } from './QuickActionButton'

import type { Conversation, SummarizationSession } from '../../types'
import { getSummary } from '../../utils/ai'

interface Props {
  userInput: string
  disabled: boolean
  isResponseLoading: boolean
  summarizationSession: SummarizationSession | undefined
  isStreamingResponse: boolean
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
  setIsResponseLoading: Dispatch<SetStateAction<boolean>>
  setSummarizationSession: Dispatch<SetStateAction<SummarizationSession | undefined>>
}

export const SummarizeButton = ({
  userInput,
  disabled,
  isResponseLoading,
  summarizationSession,
  isStreamingResponse,
  setUserInput,
  setConversation,
  setIsResponseLoading,
  setSummarizationSession,
}: Props) => {
  const { t } = useTranslation()
  const summarizeText = t('buttons.summarize')

  const handleGetResponse = async () => {
    setIsResponseLoading(true)
    setUserInput('')
    await getSummary(userInput, summarizationSession, setConversation, setSummarizationSession)
    setIsResponseLoading(false)
  }

  const isDisabled = !userInput || isResponseLoading || disabled || isStreamingResponse

  return (
    <QuickActionButton disabled={isDisabled} onClick={handleGetResponse}>
      {summarizeText}
    </QuickActionButton>
  )
}
