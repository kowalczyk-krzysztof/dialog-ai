import type { Dispatch, SetStateAction } from 'react'
import type { AIAvailability } from '../../../types/types'
import { ExplainButton } from './ExplainButton'
import { TranslateButton } from './TranslateButton'
import { SummarizeButton } from './SummarizeButton'

interface Props {
  promptText: string
  setResponse: Dispatch<SetStateAction<string>>
  quickActions: AIAvailability
}

export const QuickActionContainer = ({ promptText, setResponse, quickActions }: Props) => (
  <div className='popupai-quick-action-container'>
    <ExplainButton promptText={promptText} setResponse={setResponse} disabled={!quickActions.prompt.available} />
    <TranslateButton promptText={promptText} setResponse={setResponse} disabled={!quickActions.translation.available} />
    <SummarizeButton
      promptText={promptText}
      setResponse={setResponse}
      disabled={!quickActions.summarization.available}
    />
  </div>
)
