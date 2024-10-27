import { TranslateButton } from './TranslateButton'
import { SummarizeButton } from './SummarizeButton'

export const QuickActionContainer = () => (
  <div className='my-2 flex gap-2'>
    <TranslateButton />
    <SummarizeButton />
  </div>
)
