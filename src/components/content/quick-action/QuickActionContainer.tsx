import type { Dispatch, SetStateAction } from 'react'
import type { AIAvailability, Conversation } from '../../../types/types'
import { TranslateButton } from './TranslateButton'
import { SummarizeButton } from './SummarizeButton'

interface Props {
  setConversation: Dispatch<SetStateAction<Conversation>>
  quickActions: AIAvailability
  currentUserInput: string
  setCurrentUserInput: Dispatch<SetStateAction<string>>
}

export const QuickActionContainer = ({
  setConversation,
  quickActions,
  currentUserInput,
  setCurrentUserInput,
}: Props) => (
  <div className='popupai-quick-action-container'>
    <TranslateButton
      promptText={currentUserInput}
      setConversation={setConversation}
      disabled={!quickActions.translation.available}
      setCurrentUserInput={setCurrentUserInput}
    />
    <SummarizeButton
      promptText={currentUserInput}
      setConversation={setConversation}
      disabled={!quickActions.summarization.available}
      setCurrentUserInput={setCurrentUserInput}
    />
  </div>
)
