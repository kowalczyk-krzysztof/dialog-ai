import type { Dispatch, SetStateAction } from 'react'
import type { Conversation } from '../../../types/types'
import { SendPromptButton } from './SendPromptButton'

interface Props {
  userInput: string
  disabled: boolean
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
}

export const UserInputContainer = ({ userInput, disabled, setUserInput, setConversation }: Props) => (
  <div>
    <textarea
      className='dialogai-user-input-container'
      value={userInput}
      onChange={e => setUserInput(e.target.value)}
    />
    <SendPromptButton
      userInput={userInput}
      setUserInput={setUserInput}
      disabled={disabled}
      setConversation={setConversation}
    />
  </div>
)
