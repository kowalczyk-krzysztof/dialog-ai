import { type Dispatch, type SetStateAction, useState } from 'react'
import { QuickActionButton } from './QuickActionButton'
import { getSummary } from '../../../utils/ai'
import language from '../../../lib/language'

interface Props {
  promptText: string
  setResponse: Dispatch<SetStateAction<string>>
  disabled: boolean
}

export const SummarizeButton = ({ setResponse, promptText, disabled }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGetResponse = async () => {
    setIsLoading(true)
    await getSummary(promptText, setResponse)
    setIsLoading(false)
  }

  const isDisabled = !promptText || isLoading || disabled

  return (
    <QuickActionButton disabled={isDisabled} onClick={handleGetResponse}>
      {language.en.buttons.summarize}
    </QuickActionButton>
  )
}
