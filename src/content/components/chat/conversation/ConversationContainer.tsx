import { useEffect, useRef } from 'react'
import { Root as ScrollAreaRoot, ScrollAreaViewport } from '@radix-ui/react-scroll-area'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../../../store'
import { MessageContainer } from './MessageContainer'
import { LoadingDots } from '../../../../shared/components/LoadingDots'
import { Scrollbar } from '../../../../shared/components/Scrollbar'
import { SCROLLBAR_HIDE_TIMER_MS } from '../../../../../constants'

export const ConversationContainer = () => {
  const { conversation, isResponseLoading } = useContentStore(
    useShallow(state => ({
      conversation: state.conversation,
      isResponseLoading: state.isResponseLoading,
    }))
  )
  const scrollableAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollableAreaRef.current) {
      scrollableAreaRef.current.scrollTop = scrollableAreaRef.current.scrollHeight
    }
  }, [conversation])

  return (
    <ScrollAreaRoot className='w-full' scrollHideDelay={SCROLLBAR_HIDE_TIMER_MS}>
      <ScrollAreaViewport ref={scrollableAreaRef}>
        <section aria-relevant='additions text' aria-live='polite' role='log' className='flex h-96 flex-col gap-2'>
          {conversation.messages.map(message => (
            <MessageContainer {...message} key={message.id} />
          ))}
          {isResponseLoading ? <LoadingDots /> : null}
        </section>
      </ScrollAreaViewport>
      <Scrollbar />
    </ScrollAreaRoot>
  )
}
