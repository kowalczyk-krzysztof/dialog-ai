import { useState, type Dispatch, type SetStateAction } from 'react'
import type { LanguageModelSession, Conversation } from '../../../types/types'
import { getPromptStreamingResponse } from '../../../utils/ai'

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
    <button disabled={isDisabled} onClick={handleGetResponse} className='dialogai-quick-action-button'>
      Send Prompt
    </button>
  )
}
