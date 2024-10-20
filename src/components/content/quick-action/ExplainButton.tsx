import { type Dispatch, type SetStateAction, useState } from 'react'
import { QuickActionButton } from './QuickActionButton'
import { getPromptStreamingResponse } from '../../../utils/ai'
import language from '../../../lib/language'

interface Props {
  promptText: string
  setResponse: Dispatch<SetStateAction<string>>
  disabled: boolean
}

export const ExplainButton = ({ setResponse, promptText, disabled }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGetResponse = async () => {
    setIsLoading(true)
    await getPromptStreamingResponse(promptText, setResponse)
    setIsLoading(false)
  }

  const isDisabled = !promptText || isLoading || disabled

  return (
    <QuickActionButton disabled={isDisabled} onClick={handleGetResponse}>
      {language.en.buttons.explain}
    </QuickActionButton>
  )
}
