import type { Dispatch, SetStateAction } from 'react'
import type { Conversation } from '../../../types/types'
import { SendPromptButton } from './SendPromptButton'

interface Props {
  userInput: string
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
  disabled: boolean
}

export const UserInputContainer = ({ userInput, setUserInput, disabled, setConversation }: Props) => (
  <div>
    <textarea className='popupai-user-input-container' value={userInput} onChange={e => setUserInput(e.target.value)} />
    <SendPromptButton
      userInput={userInput}
      setUserInput={setUserInput}
      disabled={disabled}
      setConversation={setConversation}
    />
  </div>
)
