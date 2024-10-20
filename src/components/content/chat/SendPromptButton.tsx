import { useState, type Dispatch, type SetStateAction } from 'react'
import type { LanguageModelSession, Conversation } from '../../../types/types'
import { getPromptStreamingResponse } from '../../../utils/ai'

interface Props {
  userInput: string
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
  disabled: boolean
}

export const SendPromptButton = ({ setConversation, userInput, disabled, setUserInput }: Props) => {
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
    console.log(session)
  }

  const isDisabled = !userInput || isLoading || disabled

  return (
    <button disabled={isDisabled} onClick={handleGetResponse} className='popupai-quick-action-button'>
      Send Prompt
    </button>
  )
}
