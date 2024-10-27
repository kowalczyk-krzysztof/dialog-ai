import { ChangeEvent, forwardRef, KeyboardEvent, Ref } from 'react'
import { SendChatMessageButton } from './SendChatMessageButton'
import { useContentStore } from '../../store'
import { useShallow } from 'zustand/react/shallow'
import { getChatStreamingResponse } from '../../utils/ai'

export const UserInputContainer = forwardRef<HTMLTextAreaElement>((_, ref: Ref<HTMLTextAreaElement>) => {
  const { userInput, isResponseLoading, isStreamingResponse, setUserInput, setIsResponseLoading } = useContentStore(
    useShallow(state => ({
      userInput: state.userInput,
      isResponseLoading: state.isResponseLoading,
      isStreamingResponse: state.isStreamingResponse,
      setUserInput: state.setUserInput,
      setIsResponseLoading: state.setIsResponseLoading,
    }))
  )
  const handleEnterKey = async (e: KeyboardEvent) => {
    const hasTextAndNoResponseInProgress = userInput.length > 0 && !isResponseLoading && !isStreamingResponse
    if (e.key === 'Enter' && !e.shiftKey && hasTextAndNoResponseInProgress) {
      e.preventDefault()
      setIsResponseLoading(true)
      await getChatStreamingResponse()
      setIsResponseLoading(false)
    }
  }

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value)
  }

  return (
    <div className='flex h-52 w-full items-center rounded-lg bg-tertiary p-2'>
      <textarea
        ref={ref}
        value={userInput}
        className='size-full resize-none rounded-lg bg-primary p-2 text-sm focus:outline focus:outline-2 focus:outline-border'
        onChange={handleOnChange}
        onKeyDown={handleEnterKey}
      />
      <SendChatMessageButton />
    </div>
  )
})

UserInputContainer.displayName = 'UserInputContainer'
