import { type Dispatch, type SetStateAction, useState } from 'react'
import { QuickActionButton } from './QuickActionButton'
import { getTranslation } from '../../../utils/ai'
import language from '../../../lib/language'
import { type Conversation } from '../../../types/types'

interface Props {
  userInput: string
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
  disabled: boolean
}

export const TranslateButton = ({ setConversation, userInput, disabled, setUserInput }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGetResponse = async () => {
    setUserInput('')
    setIsLoading(true)
    await getTranslation(userInput, setConversation)
    setIsLoading(false)
  }

  const isDisabled = !userInput || isLoading || disabled

  return (
    <QuickActionButton disabled={isDisabled} onClick={handleGetResponse}>
      {language.en.buttons.translate}
    </QuickActionButton>
  )
}
