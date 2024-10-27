import { ChangeEvent, forwardRef, KeyboardEvent, Ref } from 'react'
import { SendChatMessageButton } from './SendChatMessageButton'
import { useContentStore } from '../../store'
import { useShallow } from 'zustand/react/shallow'
import { getChatStreamingResponse } from '../../utils/ai'

export const UserInputContainer = forwardRef<HTMLTextAreaElement>((_, ref: Ref<HTMLTextAreaElement>) => {
  const { userInput, aiApiAvailability, setUserInput, setIsResponseLoading, areControlsDisabled } = useContentStore(
    useShallow(state => ({
      userInput: state.userInput,
      aiApiAvailability: state.aiApiAvailability,
      setUserInput: state.setUserInput,
      setIsResponseLoading: state.setIsResponseLoading,
      areControlsDisabled: state.areControlsDisabled,
    }))
  )
  const handleEnterKey = async (e: KeyboardEvent) => {
    const controlsDisabled = areControlsDisabled() || !aiApiAvailability.chat.available
    if (e.key === 'Enter' && !e.shiftKey && !controlsDisabled) {
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
        className='size-full resize-none rounded-lg bg-secondary p-2 text-sm'
        onChange={handleOnChange}
        onKeyDown={handleEnterKey}
      />
      <SendChatMessageButton />
    </div>
  )
})

UserInputContainer.displayName = 'UserInputContainer'
