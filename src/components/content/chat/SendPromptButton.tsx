import { useState, type Dispatch, type SetStateAction } from 'react'
import type { LanguageModelSession, Conversation } from '../../../types/types'
import { getPromptStreamingResponse } from '../../../utils/ai'
import Play from '../../icons/play.svg?react'

interface Props {
  userInput: string
  disabled: boolean
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
}

export const SendPromptButton = ({ userInput, disabled, setConversation, setUserInput }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [session, setSession] = useState<LanguageModelSession | undefined>()

  const handleGetResponse = async () => {
    setIsLoading(true)
    setUserInput('')
    const aiSession = await getPromptStreamingResponse(userInput, setConversation)
    setSession(aiSession)
    setIsLoading(false)
    // TODO: Continue session
    await aiSession.destroy()
    return session
  }

  const isDisabled = !userInput || isLoading || disabled

  return (
    <button
      disabled={isDisabled}
      onClick={handleGetResponse}
      className='group inline-flex cursor-pointer justify-center rounded-full p-2 disabled:cursor-not-allowed'
    >
      <Play className='size-5 fill-blue-600 hover:fill-blue-400 group-disabled:fill-neutral-400' />
      <span className='sr-only'>Send message</span>
    </button>
  )
}
