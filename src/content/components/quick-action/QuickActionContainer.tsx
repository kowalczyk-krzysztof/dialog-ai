import { TranslateButton } from './TranslateButton'
import { SummarizeButton } from './SummarizeButton'

export const QuickActionContainer = () => (
  <div className='my-2 flex justify-start w-full'>
    <TranslateButton />
    <SummarizeButton />
  </div>
)
