import { Dispatch, SetStateAction, useState } from 'react'
import language from '../../../lib/language'
import { QuickActionButton } from './QuickActionButton'
import { getTranslation } from '../../../utils/ai'

interface Props {
  promptText: string
  setResponse: Dispatch<SetStateAction<string>>
}

export const TranslateButton = ({ setResponse, promptText }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGetResponse = async () => {
    setIsLoading(true)
    await getTranslation(promptText, setResponse)
    setIsLoading(false)
  }
  return (
    <QuickActionButton disabled={isLoading} onClick={handleGetResponse}>
      {language.en.buttons.translate}
    </QuickActionButton>
  )
}
