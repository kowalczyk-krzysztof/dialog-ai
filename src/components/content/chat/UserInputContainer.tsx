import { forwardRef, Ref, type Dispatch, type SetStateAction } from 'react'
import type { Conversation } from '../../../types/types'
import { SendPromptButton } from './SendPromptButton'

interface Props {
  userInput: string
  disabled: boolean
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
}

export const UserInputContainer = forwardRef<HTMLTextAreaElement, Props>(
  ({ userInput, disabled, setUserInput, setConversation }, ref: Ref<HTMLTextAreaElement>) => (
    <div className='flex h-52 w-full items-center rounded-lg bg-gray-700  p-2'>
      <textarea
        ref={ref}
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        // disabled={disabled} TODO: Fix disabled logic
        className='size-full resize-none rounded-lg bg-neutral-600 p-2 text-sm'
      />
      <SendPromptButton
        userInput={userInput}
        setUserInput={setUserInput}
        disabled={disabled}
        setConversation={setConversation}
      />
    </div>
  )
)

UserInputContainer.displayName = 'UserInputContainer'
