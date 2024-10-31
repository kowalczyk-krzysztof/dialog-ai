import { TranslationButton } from './translation/TranslationButton'
import { SummarizationButton } from './summarization/SummarizationButton'

export const QuickActionContainer = () => (
  <div className='mt-4 flex justify-between items-center w-full'>
    <TranslationButton />
    <SummarizationButton />
  </div>
)
