import { Dispatch, SetStateAction, useState } from 'react'
import { getPromptStreamingResponse } from '../../../utils/ai'
import language from '../../../lib/language'
import { QuickActionButton } from './QuickActionButton'

interface Props {
  promptText: string
  setResponse: Dispatch<SetStateAction<string>>
}

export const ExplainButton = ({ setResponse, promptText }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGetResponse = async () => {
    setIsLoading(true)
    await getPromptStreamingResponse(promptText, setResponse)
    setIsLoading(false)
  }

  return (
    <QuickActionButton disabled={isLoading} onClick={handleGetResponse}>
      {language.en.buttons.explain}
    </QuickActionButton>
  )
}
