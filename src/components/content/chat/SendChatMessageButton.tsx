import { useState, type Dispatch, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import type { ChatSession, Conversation } from '../../../types/types'
import { getChatStreamingResponse } from '../../../utils/ai'
import Send from '../../icons/send.svg?react'

interface Props {
  userInput: string
  disabled: boolean
  isResponseLoading: boolean
  chatSession: ChatSession | undefined
  isStreamingResponse: boolean
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
  setIsResponseLoading: Dispatch<SetStateAction<boolean>>
  setChatSession: Dispatch<SetStateAction<ChatSession | undefined>>
  setIsStreamingResponse: Dispatch<SetStateAction<boolean>>
}

export const SendChatMessageButton = ({
  userInput,
  disabled,
  isResponseLoading,
  chatSession,
  isStreamingResponse,
  setConversation,
  setUserInput,
  setIsResponseLoading,
  setChatSession,
  setIsStreamingResponse,
}: Props) => {
  const { t } = useTranslation()
  const sendText = t('buttons.send')

  const handleGetResponse = async () => {
    setIsResponseLoading(true)
    setUserInput('')
    await getChatStreamingResponse(
      userInput,
      chatSession,
      setConversation,
      setIsResponseLoading,
      setChatSession,
      setIsStreamingResponse
    )
    setIsResponseLoading(false)
  }

  const isDisabled = !userInput || isResponseLoading || disabled || isStreamingResponse

  return (
    <button
      disabled={isDisabled}
      onClick={handleGetResponse}
      className='group inline-flex cursor-pointer justify-center rounded-full p-2 disabled:cursor-not-allowed'
    >
      <AccessibleIcon label={sendText}>
        <Send className='size-5 fill-blue-600 hover:fill-blue-400 group-disabled:fill-neutral-400' />
      </AccessibleIcon>
    </button>
  )
}
