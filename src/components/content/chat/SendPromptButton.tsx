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
    <button
      disabled={isDisabled}
      onClick={handleGetResponse}
      className='inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600'
    >
      <svg
        className='w-5 h-5 rotate-90 rtl:-rotate-90'
        aria-hidden='true'
        xmlns='http://www.w3.org/2000/svg'
        fill='currentColor'
        viewBox='0 0 18 20'
      >
        <path d='m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z' />
      </svg>
      <span className='sr-only'>Send message</span>
    </button>
  )
}
