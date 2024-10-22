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
    <div>
      <textarea ref={ref} value={userInput} onChange={e => setUserInput(e.target.value)} disabled={disabled} />
      <SendPromptButton
        userInput={userInput}
        setUserInput={setUserInput}
        disabled={disabled}
        setConversation={setConversation}
      />
    </div>
  )
)
