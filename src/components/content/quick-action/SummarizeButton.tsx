import { type Dispatch, type SetStateAction, useState } from 'react'
import { QuickActionButton } from './QuickActionButton'
import { getSummary } from '../../../utils/ai'
import language from '../../../lib/language'
import type { Conversation } from '../../../types/types'

interface Props {
  promptText: string
  setConversation: Dispatch<SetStateAction<Conversation>>
  disabled: boolean
  setCurrentUserInput: Dispatch<SetStateAction<string>>
}

export const SummarizeButton = ({ setConversation, promptText, disabled, setCurrentUserInput }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGetResponse = async () => {
    setIsLoading(true)
    setCurrentUserInput('')
    const session = await getSummary(promptText, setConversation)
    setIsLoading(false)
    // TODO: Continue session
    await session.destroy()
  }

  const isDisabled = !promptText || isLoading || disabled

  return (
    <QuickActionButton disabled={isDisabled} onClick={handleGetResponse}>
      {language.en.buttons.summarize}
    </QuickActionButton>
  )
}
