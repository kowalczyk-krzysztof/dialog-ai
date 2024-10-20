import type { Dispatch, SetStateAction } from 'react'

interface Props {
  currentUserInput: string
  setCurrentUserInput: Dispatch<SetStateAction<string>>
}

export const UserInputContainer = ({ currentUserInput, setCurrentUserInput }: Props) => (
  <textarea
    className='popupai-user-input-container'
    value={currentUserInput}
    onChange={e => setCurrentUserInput(e.target.value)}
  />
)
