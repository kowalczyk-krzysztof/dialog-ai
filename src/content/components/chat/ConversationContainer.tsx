import { useEffect, useRef } from 'react'
import {
  Root as ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from '@radix-ui/react-scroll-area'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../../store'
import { MessageContainer } from './MessageContainer'
import { LoadingDots } from '../../../shared/components/LoadingDots'
import { MessageRole } from '../../types'

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
    <ScrollAreaRoot className='w-full'>
      <ScrollAreaViewport ref={scrollableAreaRef}>
        <div className='flex h-96 flex-col gap-2'>
          {conversation.messages.map(({ role, id, text, isError, type }) => (
            <MessageContainer text={text} isUser={role === MessageRole.USER} key={id} isError={isError} type={type} />
          ))}
          {isResponseLoading ? <LoadingDots /> : null}
        </div>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation='vertical'>
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaCorner />
    </ScrollAreaRoot>
  )
}
