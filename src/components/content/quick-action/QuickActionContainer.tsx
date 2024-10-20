import type { Dispatch, SetStateAction } from 'react'
import { type AIAvailability, type Conversation } from '../../../types/types'
import { ExplainButton } from './ExplainButton'
import { TranslateButton } from './TranslateButton'
import { SummarizeButton } from './SummarizeButton'

interface Props {
  conversation: Conversation
  setConversation: Dispatch<SetStateAction<Conversation>>
  quickActions: AIAvailability
  currentUserInput: string
  setCurrentUserInput: Dispatch<SetStateAction<string>>
}

export const QuickActionContainer = ({
  conversation,
  setConversation,
  quickActions,
  currentUserInput,
  setCurrentUserInput,
}: Props) => (
  <div className='popupai-quick-action-container'>
    <ExplainButton
      promptText={currentUserInput}
      setConversation={setConversation}
      conversation={conversation}
      disabled={!quickActions.prompt.available}
      setCurrentUserInput={setCurrentUserInput}
    />
    <TranslateButton
      promptText={currentUserInput}
      setConversation={setConversation}
      conversation={conversation}
      disabled={!quickActions.translation.available}
      setCurrentUserInput={setCurrentUserInput}
    />
    <SummarizeButton
      promptText={currentUserInput}
      setConversation={setConversation}
      conversation={conversation}
      disabled={!quickActions.summarization.available}
      setCurrentUserInput={setCurrentUserInput}
    />
  </div>
)
