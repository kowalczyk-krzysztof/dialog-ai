import type { Dispatch, SetStateAction } from 'react'
import type { AIApiAvailability, Conversation } from '../../../types/types'
import { TranslateButton } from './TranslateButton'
import { SummarizeButton } from './SummarizeButton'

interface Props {
  userInput: string
  AIApiAvailability: AIApiAvailability
  isResponseLoading: boolean
  setConversation: Dispatch<SetStateAction<Conversation>>
  setUserInput: Dispatch<SetStateAction<string>>
  setIsResponseLoading: Dispatch<SetStateAction<boolean>>
}

export const QuickActionContainer = ({
  userInput,
  AIApiAvailability,
  isResponseLoading,
  setUserInput,
  setConversation,
  setIsResponseLoading,
}: Props) => (
  <div className='my-2 flex gap-2'>
    <TranslateButton
      userInput={userInput}
      disabled={!AIApiAvailability.translation.available}
      isResponseLoading={isResponseLoading}
      setUserInput={setUserInput}
      setConversation={setConversation}
      setIsResponseLoading={setIsResponseLoading}
    />
    <SummarizeButton
      userInput={userInput}
      disabled={!AIApiAvailability.summarization.available}
      isResponseLoading={isResponseLoading}
      setUserInput={setUserInput}
      setConversation={setConversation}
      setIsResponseLoading={setIsResponseLoading}
    />
  </div>
)
