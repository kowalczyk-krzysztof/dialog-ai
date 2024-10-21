import { type Dispatch, type SetStateAction, useState } from 'react'
import { QuickActionButton } from './QuickActionButton'
import { getSummary } from '../../../utils/ai'
import type { Conversation } from '../../../types/types'
import { useTranslation } from 'react-i18next'

interface Props {
  userInput: string
  disabled: boolean
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
}

export const SummarizeButton = ({ userInput, disabled, setUserInput, setConversation }: Props) => {
  const { t } = useTranslation()
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
      {t('buttons.summarize')}
    </QuickActionButton>
  )
}
