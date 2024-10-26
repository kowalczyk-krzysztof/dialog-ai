import { useState, type Dispatch, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import type { LanguageModelSession, Conversation } from '../../../types/types'
import { getChatStreamingResponse } from '../../../utils/ai'
import Send from '../../icons/send.svg?react'

interface Props {
  userInput: string
  disabled: boolean
  isResponseLoading: boolean
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
  setIsResponseLoading: Dispatch<SetStateAction<boolean>>
}

export const SendChatMessageButton = ({
  userInput,
  disabled,
  isResponseLoading,
  setConversation,
  setUserInput,
  setIsResponseLoading,
}: Props) => {
  const [session, setSession] = useState<LanguageModelSession | undefined>()
  const { t } = useTranslation()
  const sendText = t('buttons.send')

  const handleGetResponse = async () => {
    setIsResponseLoading(true)
    setUserInput('')
    const aiSession = await getChatStreamingResponse(userInput, setConversation, setIsResponseLoading)
    setSession(aiSession)
    // TODO: Continue session
    if (aiSession) {
      await aiSession.destroy()
      return session
    }
  }

  const isDisabled = !userInput || isResponseLoading || disabled

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
