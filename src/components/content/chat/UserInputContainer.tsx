import { forwardRef, Ref, type Dispatch, type SetStateAction } from 'react'
import type { Conversation } from '../../../types/types'
import { SendPromptButton } from './SendPromptButton'

interface Props {
  userInput: string
  disabled: boolean
  isResponseLoading: boolean
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
  setIsResponseLoading: Dispatch<SetStateAction<boolean>>
}

export const UserInputContainer = forwardRef<HTMLTextAreaElement, Props>(
  (
    { userInput, disabled, isResponseLoading, setUserInput, setConversation, setIsResponseLoading },
    ref: Ref<HTMLTextAreaElement>
  ) => (
    <div className='flex h-52 w-full items-center rounded-lg bg-gray-700 p-2'>
      <textarea
        ref={ref}
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        className='size-full resize-none rounded-lg bg-neutral-600 p-2 text-sm focus:outline focus:outline-2 focus:outline-blue-600'
      />
      <SendPromptButton
        userInput={userInput}
        disabled={disabled}
        isResponseLoading={isResponseLoading}
        setUserInput={setUserInput}
        setConversation={setConversation}
        setIsResponseLoading={setIsResponseLoading}
      />
    </div>
  )
)

UserInputContainer.displayName = 'UserInputContainer'
