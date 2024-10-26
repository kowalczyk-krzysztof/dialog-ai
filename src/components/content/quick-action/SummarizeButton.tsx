import { type Dispatch, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { QuickActionButton } from './QuickActionButton'
import { getSummary } from '../../../utils/ai'
import type { Conversation } from '../../../types/types'

interface Props {
  userInput: string
  disabled: boolean
  isResponseLoading: boolean
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
  setIsResponseLoading: Dispatch<SetStateAction<boolean>>
}

export const SummarizeButton = ({
  userInput,
  disabled,
  isResponseLoading,
  setUserInput,
  setConversation,
  setIsResponseLoading,
}: Props) => {
  const { t } = useTranslation()
  const summarizeText = t('buttons.summarize')

  const handleGetResponse = async () => {
    setIsResponseLoading(true)
    setUserInput('')
    const session = await getSummary(userInput, setConversation)
    setIsResponseLoading(false)
    // TODO: Continue session
    if (session) {
      await session.destroy()
    }
  }

  const isDisabled = !userInput || isResponseLoading || disabled

  return (
    <QuickActionButton disabled={isDisabled} onClick={handleGetResponse}>
      {summarizeText}
    </QuickActionButton>
  )
}
