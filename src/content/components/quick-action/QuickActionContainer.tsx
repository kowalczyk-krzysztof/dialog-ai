import { TranslateButton } from './TranslateButton'
import { SummarizeButton } from './SummarizeButton'

export const QuickActionContainer = () => (
  <div className='my-2 flex justify-start w-full mx-1'>
    <TranslateButton />
    <SummarizeButton />
  </div>
)
