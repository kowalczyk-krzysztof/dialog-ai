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
      className='group inline-flex cursor-pointer justify-center rounded-full p-2 disabled:cursor-not-allowed'
    >
      <AccessibleIcon label={sendText}>
        <Send className='size-5 fill-primary hover:fill-primary-hover group-disabled:fill-disabled' />
      </AccessibleIcon>
    </button>
  )
}
