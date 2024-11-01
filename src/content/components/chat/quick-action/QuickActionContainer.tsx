import { TranslationButton } from './translation/TranslationButton'
import { SummarizationButton } from './summarization/SummarizationButton'

export const QuickActionContainer = () => (
  <div className='flex w-full items-center justify-between'>
    <TranslationButton />
    <SummarizationButton />
  </div>
)
