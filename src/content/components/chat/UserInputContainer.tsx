import { forwardRef, Ref } from 'react'
import { SendChatMessageButton } from './SendChatMessageButton'
import { useContentStore } from '../../store'
import { useShallow } from 'zustand/react/shallow'

export const UserInputContainer = forwardRef<HTMLTextAreaElement>((_, ref: Ref<HTMLTextAreaElement>) => {
  const { userInput, setUserInput } = useContentStore(
    useShallow(state => ({
      userInput: state.userInput,
      setAiApiAvailability: state.setAiApiAvailability,
      setUserInput: state.setUserInput,
    }))
  )
  return (
    <div className='flex h-52 w-full items-center rounded-lg bg-gray-700 p-2'>
      <textarea
        ref={ref}
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        className='size-full resize-none rounded-lg bg-neutral-600 p-2 text-sm focus:outline focus:outline-2 focus:outline-blue-600'
      />
      <SendChatMessageButton />
    </div>
  )
})

UserInputContainer.displayName = 'UserInputContainer'
