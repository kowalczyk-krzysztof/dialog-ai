import { type Dispatch, type SetStateAction, useState } from 'react'
import { QuickActionButton } from './QuickActionButton'
import { getSummary } from '../../../utils/ai'
import language from '../../../lib/language'
import type { Conversation } from '../../../types/types'

interface Props {
  userInput: string
  disabled: boolean
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
}

export const SummarizeButton = ({ userInput, disabled, setUserInput, setConversation }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGetResponse = async () => {
    setIsLoading(true)
    setUserInput('')
    const session = await getSummary(userInput, setConversation)
    setIsLoading(false)
    // TODO: Continue session
    await session.destroy()
  }

  const isDisabled = !userInput || isLoading || disabled

  return (
    <QuickActionButton disabled={isDisabled} onClick={handleGetResponse}>
      {language.en.buttons.summarize}
    </QuickActionButton>
  )
}
