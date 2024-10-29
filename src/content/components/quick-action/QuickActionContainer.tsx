import { TranslationButton } from '../quick-action/translation/TranslationButton'
import { SummarizationButton } from '../quick-action/summarization/SummarizationButton'

export const QuickActionContainer = () => (
  <div className='mt-4 flex justify-between items-center w-full'>
    <TranslationButton />
    <SummarizationButton />
  </div>
)
