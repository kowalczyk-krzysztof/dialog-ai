import { useTranslation } from 'react-i18next'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../../../store'
import { getChatStreamingResponse } from '../../../api/chat'
import Send from '../../../../shared/icons/send.svg?react'

export const SendChatMessageButton = () => {
  const { t } = useTranslation()
  const { aiApiAvailability, setIsResponseLoading, areControlsDisabled } = useContentStore(
    useShallow(state => ({
      aiApiAvailability: state.aiApiAvailability,
      setIsResponseLoading: state.setIsResponseLoading,
      areControlsDisabled: state.areControlsDisabled,
    }))
  )

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
      className='group flex rounded-full p-2 disabled:cursor-not-allowed hover:bg-tertiary-hover disabled:bg-tertiary'
      onClick={handleGetResponse}
    >
      <AccessibleIcon label={sendText}>
        <Send className='size-5 fill-primary group-hover:fill-primary-hover group-disabled:fill-disabled ml-0.5' />
      </AccessibleIcon>
    </button>
  )
}
