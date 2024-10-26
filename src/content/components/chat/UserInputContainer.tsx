import { forwardRef, Ref, type Dispatch, type SetStateAction } from 'react'
import type { ChatSession, Conversation } from '../../types'
import { SendChatMessageButton } from './SendChatMessageButton'

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

export const UserInputContainer = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      userInput,
      disabled,
      isResponseLoading,
      chatSession,
      isStreamingResponse,
      setUserInput,
      setConversation,
      setIsResponseLoading,
      setChatSession,
      setIsStreamingResponse,
    },
    ref: Ref<HTMLTextAreaElement>
  ) => (
    <div className='flex h-52 w-full items-center rounded-lg bg-gray-700 p-2'>
      <textarea
        ref={ref}
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        className='size-full resize-none rounded-lg bg-neutral-600 p-2 text-sm focus:outline focus:outline-2 focus:outline-blue-600'
      />
      <SendChatMessageButton
        userInput={userInput}
        disabled={disabled}
        isResponseLoading={isResponseLoading}
        chatSession={chatSession}
        isStreamingResponse={isStreamingResponse}
        setUserInput={setUserInput}
        setConversation={setConversation}
        setIsResponseLoading={setIsResponseLoading}
        setChatSession={setChatSession}
        setIsStreamingResponse={setIsStreamingResponse}
      />
    </div>
  )
)

UserInputContainer.displayName = 'UserInputContainer'
