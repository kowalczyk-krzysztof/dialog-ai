import { useState, type Dispatch, type SetStateAction } from 'react'
import { LanguageModelSession, type Conversation } from '../../../types/types'
import { getPromptStreamingResponse } from '../../../utils/ai'

interface Props {
  promptText: string
  setConversation: Dispatch<SetStateAction<Conversation>>
  disabled: boolean
  setCurrentUserInput: Dispatch<SetStateAction<string>>
}

export const SendPromptButton = ({ setConversation, promptText, disabled, setCurrentUserInput }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [session, setSession] = useState<LanguageModelSession | undefined>()

  const handleGetResponse = async () => {
    setIsLoading(true)
    setCurrentUserInput('')
    const aiSession = await getPromptStreamingResponse(promptText, setConversation)
    setSession(aiSession)
    setIsLoading(false)
    // TODO: Continue session
    await aiSession.destroy()
    console.log(session)
  }

  const isDisabled = !promptText || isLoading || disabled

  return (
    <button disabled={isDisabled} onClick={handleGetResponse} className='popupai-quick-action-button'>
      Send Prompt
    </button>
  )
}
