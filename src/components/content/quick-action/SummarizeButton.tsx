import { Dispatch, SetStateAction, useState } from 'react'
import language from '../../../lib/language'
import { QuickActionButton } from './QuickActionButton'
import { getSummary } from '../../../utils/ai'

interface Props {
  promptText: string
  setResponse: Dispatch<SetStateAction<string>>
}

export const SummarizeButton = ({ setResponse, promptText }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGetResponse = async () => {
    setIsLoading(true)
    await getSummary(promptText, setResponse)
    setIsLoading(false)
  }
  return (
    <QuickActionButton disabled={isLoading} onClick={handleGetResponse}>
      {language.en.buttons.summarize}
    </QuickActionButton>
  )
}
