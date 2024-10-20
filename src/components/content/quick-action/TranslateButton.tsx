import { type Dispatch, type SetStateAction, useState } from 'react'
import { QuickActionButton } from './QuickActionButton'
import { getTranslation } from '../../../utils/ai'
import language from '../../../lib/language'
import { type Conversation } from '../../../types/types'

interface Props {
  promptText: string
  conversation: Conversation
  setConversation: Dispatch<SetStateAction<Conversation>>
  disabled: boolean
  setCurrentUserInput: Dispatch<SetStateAction<string>>
}

export const TranslateButton = ({
  setConversation,
  promptText,
  disabled,
  conversation,
  setCurrentUserInput,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGetResponse = async () => {
    setCurrentUserInput('')
    setIsLoading(true)
    await getTranslation(promptText, setConversation, conversation)
    setIsLoading(false)
  }

  const isDisabled = !promptText || isLoading || disabled

  return (
    <QuickActionButton disabled={isDisabled} onClick={handleGetResponse}>
      {language.en.buttons.translate}
    </QuickActionButton>
  )
}
