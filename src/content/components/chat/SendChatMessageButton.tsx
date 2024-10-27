import { useTranslation } from 'react-i18next'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import Send from '../../icons/send.svg?react'
import { getChatStreamingResponse } from '../../utils/ai'
import { useContentStore } from '../../store'
import { useShallow } from 'zustand/react/shallow'

export const SendChatMessageButton = () => {
  const { aiApiAvailability, userInput, isResponseLoading, isStreamingResponse, setIsResponseLoading } =
    useContentStore(
      useShallow(state => ({
        userInput: state.userInput,
        aiApiAvailability: state.aiApiAvailability,
        isResponseLoading: state.isResponseLoading,
        isStreamingResponse: state.isStreamingResponse,
        setIsResponseLoading: state.setIsResponseLoading,
        setAiApiAvailability: state.setAiApiAvailability,
        reset: state.reset,
      }))
    )
  const { t } = useTranslation()
  const sendText = t('buttons.send')

  const handleGetResponse = async () => {
    setIsResponseLoading(true)
    await getChatStreamingResponse()
    setIsResponseLoading(false)
  }

  const isDisabled = !userInput || isResponseLoading || !aiApiAvailability.chat.available || isStreamingResponse

  return (
    <button
      disabled={isDisabled}
      onClick={handleGetResponse}
      className='group inline-flex cursor-pointer justify-center rounded-full p-2 disabled:cursor-not-allowed'
    >
      <AccessibleIcon label={sendText}>
        <Send className='size-5 fill-blue-600 hover:fill-blue-400 group-disabled:fill-disabled' />
      </AccessibleIcon>
    </button>
  )
}
