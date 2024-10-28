import { TranslationButton } from './TranslationButton'
import { SummarizationButton } from './SummarizationButton'

export const QuickActionContainer = () => (
  <div className='mb-2 mt-4 flex justify-start w-full'>
    <TranslationButton />
    <SummarizationButton />
  </div>
)
