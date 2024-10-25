import { useState, type Dispatch, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import * as AccessibleIcon from '@radix-ui/react-accessible-icon'
import type { LanguageModelSession, Conversation } from '../../../types/types'
import { getPromptStreamingResponse } from '../../../utils/ai'
import Send from '../../icons/send.svg?react'

interface Props {
  userInput: string
  disabled: boolean
  isResponseLoading: boolean
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
  setIsResponseLoading: Dispatch<SetStateAction<boolean>>
}

export const SendPromptButton = ({
  userInput,
  disabled,
  isResponseLoading,
  setConversation,
  setUserInput,
  setIsResponseLoading,
}: Props) => {
  const [session, setSession] = useState<LanguageModelSession | undefined>()
  const { t } = useTranslation()

  const handleGetResponse = async () => {
    setIsResponseLoading(true)
    setUserInput('')
    const aiSession = await getPromptStreamingResponse(userInput, setConversation, setIsResponseLoading)
    setSession(aiSession)
    // TODO: Continue session
    await aiSession.destroy()
    return session
  }

  const isDisabled = !userInput || isResponseLoading || disabled

  return (
    <button
      disabled={isDisabled}
      onClick={handleGetResponse}
      className='group inline-flex cursor-pointer justify-center rounded-full p-2 disabled:cursor-not-allowed'
    >
      <AccessibleIcon.Root label={t('send-message')}>
        <Send className='size-5 fill-blue-600 hover:fill-blue-400 group-disabled:fill-neutral-400' />
      </AccessibleIcon.Root>
    </button>
  )
}
