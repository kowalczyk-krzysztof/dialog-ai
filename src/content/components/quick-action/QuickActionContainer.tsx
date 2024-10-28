import { TranslateButton } from './TranslateButton'
import { SummarizeButton } from './SummarizeButton'

export const QuickActionContainer = () => (
  <div className='mb-2 mt-4 flex justify-start w-full'>
    <TranslateButton />
    <SummarizeButton />
  </div>
)
