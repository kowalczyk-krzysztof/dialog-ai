import type { Dispatch, SetStateAction } from 'react'
import type { Conversation } from '../../../types/types'
import { SendPromptButton } from './SendPromptButton'

interface Props {
  currentUserInput: string
  setConversation: Dispatch<SetStateAction<Conversation>>
  disabled: boolean
  setCurrentUserInput: Dispatch<SetStateAction<string>>
}

export const UserInputContainer = ({ currentUserInput, setCurrentUserInput, disabled, setConversation }: Props) => (
  <div>
    <textarea
      className='popupai-user-input-container'
      value={currentUserInput}
      onChange={e => setCurrentUserInput(e.target.value)}
    />
    <SendPromptButton
      promptText={currentUserInput}
      setCurrentUserInput={setCurrentUserInput}
      disabled={disabled}
      setConversation={setConversation}
    />
  </div>
)
