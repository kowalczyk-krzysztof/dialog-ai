import { Dispatch, SetStateAction } from 'react'
import { ExplainButton } from './ExplainButton'
import { TranslateButton } from './TranslateButton'
import { SummarizeButton } from './SummarizeButton'

interface Props {
  promptText: string
  setResponse: Dispatch<SetStateAction<string>>
}

export const QuickActionContainer = ({ promptText, setResponse }: Props) => (
  <div className='popupai-quick-action-container'>
    <ExplainButton promptText={promptText} setResponse={setResponse} />
    <TranslateButton />
    <SummarizeButton />
  </div>
)
