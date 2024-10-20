import type { Dispatch, SetStateAction } from 'react'

interface Props {
  text: string
  setText: Dispatch<SetStateAction<string>>
}

export const UserInputContainer = ({ text, setText }: Props) => (
  <textarea className='popupai-user-input-container' value={text} onChange={e => setText(e.target.value)} />
)
