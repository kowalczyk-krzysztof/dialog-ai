import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react'
import { Root as ScrollAreaRoot, ScrollAreaViewport } from '@radix-ui/react-scroll-area'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../../../store'
import { SendChatMessageButton } from './SendChatMessageButton'
import { getChatStreamingResponse } from '../../../api/chat'
import { Scrollbar } from '../../../../shared/components/Scrollbar'
import { SCROLLBAR_HIDE_TIMER_MS } from '../../../../../constants'

export const UserInputContainer = () => {
  const { userInput, aiApiAvailability, setUserInput, setIsResponseLoading, areControlsDisabled } = useContentStore(
    useShallow(state => ({
      userInput: state.userInput,
      aiApiAvailability: state.aiApiAvailability,
      setUserInput: state.setUserInput,
      setIsResponseLoading: state.setIsResponseLoading,
      areControlsDisabled: state.areControlsDisabled,
    }))
  )
  const handleEnterKey = async (e: KeyboardEvent) => {
    const controlsDisabled = areControlsDisabled() || !aiApiAvailability.chat.available
    if (e.key === 'Enter' && !e.shiftKey && !controlsDisabled) {
      e.preventDefault()
      setIsResponseLoading(true)
      await getChatStreamingResponse()
      setIsResponseLoading(false)
    }
  }

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value)
  }

  const handleFocus = (e: FocusEvent) => {
    const userInputContainer = e.target as HTMLTextAreaElement
    const valueLength = userInputContainer.value.length
    userInputContainer.setSelectionRange(valueLength, valueLength)
    userInputContainer.scrollTop = userInputContainer.scrollHeight
  }

  return (
    <div className='flex w-full items-center rounded-lg bg-tertiary p-2 border-border border h-24'>
      <ScrollAreaRoot className='size-full' scrollHideDelay={SCROLLBAR_HIDE_TIMER_MS}>
        <ScrollAreaViewport asChild={true}>
          <textarea
            autoFocus={true}
            value={userInput}
            className='size-full resize-none rounded-lg bg-secondary p-2 text-sm'
            onChange={handleOnChange}
            onKeyDown={handleEnterKey}
            onFocus={handleFocus}
          />
        </ScrollAreaViewport>
        <Scrollbar />
      </ScrollAreaRoot>
      <SendChatMessageButton />
    </div>
  )
}
