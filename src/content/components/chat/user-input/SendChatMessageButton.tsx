import { useTranslation } from 'react-i18next'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../../../store'
import { getChatStreamingResponse } from '../../../api/chat'
import Send from '../../../../shared/icons/send.svg?react'
import Stop from '../../../../shared/icons/stop.svg?react'

export const SendChatMessageButton = () => {
  const { t } = useTranslation()
  const { isDisabled, ongoingRequestExists, setIsResponseLoading, abortOngoingRequests } = useContentStore(
    useShallow(state => ({
      isDisabled: (state.areControlsDisabled() || !state.aiApiAvailability.chat) && !state.ongoingRequestExists(),
      ongoingRequestExists: state.ongoingRequestExists(),
      setIsResponseLoading: state.setIsResponseLoading,
      abortOngoingRequests: state.abortOngoingRequests,
    }))
  )

  const sendText = t('buttons.send')
  const abortText = t('buttons.abortOngoingRequests')

  const handleGetResponse = async () => {
    setIsResponseLoading(true)
    await getChatStreamingResponse()
    setIsResponseLoading(false)
  }

  const handleAbort = () => {
    abortOngoingRequests()
  }

  return (
    <button
      className='group flex rounded-full p-2 hover:bg-tertiary-hover disabled:cursor-not-allowed disabled:bg-tertiary'
      disabled={isDisabled}
      onClick={ongoingRequestExists ? handleAbort : handleGetResponse}
    >
      <AccessibleIcon label={ongoingRequestExists ? abortText : sendText}>
        {ongoingRequestExists ? (
          <Stop className='size-4 fill-primary group-hover:fill-primary-hover' />
        ) : (
          <Send className='size-4 fill-primary group-hover:fill-primary-hover group-disabled:fill-disabled' />
        )}
      </AccessibleIcon>
    </button>
  )
}
