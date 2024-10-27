import { useTranslation } from 'react-i18next'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import Send from '../../icons/send.svg?react'
import { getChatStreamingResponse } from '../../utils/ai'
import { useContentStore } from '../../store'
import { useShallow } from 'zustand/react/shallow'

export const SendChatMessageButton = () => {
  const { aiApiAvailability, setIsResponseLoading, areControlsDisabled } = useContentStore(
    useShallow(state => ({
      aiApiAvailability: state.aiApiAvailability,
      setIsResponseLoading: state.setIsResponseLoading,
      areControlsDisabled: state.areControlsDisabled,
    }))
  )
  const { t } = useTranslation()
  const sendText = t('buttons.send')

  const handleGetResponse = async () => {
    setIsResponseLoading(true)
    await getChatStreamingResponse()
    setIsResponseLoading(false)
  }

  const isDisabled = areControlsDisabled() || !aiApiAvailability.chat.available

  return (
    <button
      disabled={isDisabled}
      onClick={handleGetResponse}
      className='group flex cursor-pointer justify-center items-center rounded-full p-2 disabled:cursor-not-allowed hover:bg-tertiary-hover ml-2 disabled:bg-tertiary'
    >
      <AccessibleIcon label={sendText}>
        <Send className='size-5 fill-primary group-hover:fill-primary-hover group-disabled:fill-disabled ml-0.5' />
      </AccessibleIcon>
    </button>
  )
}
