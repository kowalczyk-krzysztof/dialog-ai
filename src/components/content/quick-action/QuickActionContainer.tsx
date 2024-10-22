import type { Dispatch, SetStateAction } from 'react'
import type { AIAvailability, Conversation } from '../../../types/types'
import { TranslateButton } from './TranslateButton'
import { SummarizeButton } from './SummarizeButton'

interface Props {
  availability: AIAvailability
  userInput: string
  setConversation: Dispatch<SetStateAction<Conversation>>
  setUserInput: Dispatch<SetStateAction<string>>
}

export const QuickActionContainer = ({ availability, userInput, setUserInput, setConversation }: Props) => (
  <div className='flex gap-2'>
    <TranslateButton
      userInput={userInput}
      setUserInput={setUserInput}
      setConversation={setConversation}
      disabled={!availability.translation.available}
    />
    <SummarizeButton
      userInput={userInput}
      setUserInput={setUserInput}
      setConversation={setConversation}
      disabled={!availability.summarization.available}
    />
  </div>
)
