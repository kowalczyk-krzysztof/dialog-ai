import type { Dispatch, SetStateAction } from 'react'
import type { AIApiAvailability, Conversation, SummarizationSession } from '../../../types/types'
import { TranslateButton } from './TranslateButton'
import { SummarizeButton } from './SummarizeButton'

interface Props {
  userInput: string
  AIApiAvailability: AIApiAvailability
  isResponseLoading: boolean
  summarizationSession: SummarizationSession | undefined
  isStreamingResponse: boolean
  setConversation: Dispatch<SetStateAction<Conversation>>
  setUserInput: Dispatch<SetStateAction<string>>
  setIsResponseLoading: Dispatch<SetStateAction<boolean>>
  setSummarizationSession: Dispatch<SetStateAction<SummarizationSession | undefined>>
}

export const QuickActionContainer = ({
  userInput,
  AIApiAvailability,
  isResponseLoading,
  summarizationSession,
  isStreamingResponse,
  setUserInput,
  setConversation,
  setIsResponseLoading,
  setSummarizationSession,
}: Props) => (
  <div className='my-2 flex gap-2'>
    <TranslateButton
      userInput={userInput}
      disabled={!AIApiAvailability.translation.available}
      isResponseLoading={isResponseLoading}
      isStreamingResponse={isStreamingResponse}
      setUserInput={setUserInput}
      setConversation={setConversation}
      setIsResponseLoading={setIsResponseLoading}
    />
    <SummarizeButton
      userInput={userInput}
      disabled={!AIApiAvailability.summarization.available}
      isResponseLoading={isResponseLoading}
      summarizationSession={summarizationSession}
      isStreamingResponse={isStreamingResponse}
      setUserInput={setUserInput}
      setConversation={setConversation}
      setIsResponseLoading={setIsResponseLoading}
      setSummarizationSession={setSummarizationSession}
    />
  </div>
)
