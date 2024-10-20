import type { Dispatch, SetStateAction } from 'react'
import type { AIAvailability, Conversation } from '../../../types/types'
import { TranslateButton } from './TranslateButton'
import { SummarizeButton } from './SummarizeButton'

interface Props {
  quickActions: AIAvailability
  userInput: string
  setConversation: Dispatch<SetStateAction<Conversation>>
  setUserInput: Dispatch<SetStateAction<string>>
}

export const QuickActionContainer = ({ setConversation, quickActions, userInput, setUserInput }: Props) => (
  <div className='popupai-quick-action-container'>
    <TranslateButton
      userInput={userInput}
      setUserInput={setUserInput}
      setConversation={setConversation}
      disabled={!quickActions.translation.available}
    />
    <SummarizeButton
      userInput={userInput}
      setUserInput={setUserInput}
      setConversation={setConversation}
      disabled={!quickActions.summarization.available}
    />
  </div>
)
