import {
  Root as ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from '@radix-ui/react-scroll-area'
import { MessageRole } from '../../types'
import { MessageContainer } from './MessageContainer'
import { useEffect, useRef } from 'react'
import { LoadingDots } from '../../../shared/components/LoadingDots'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../../store'

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
        <div className='my-2 flex h-72 flex-col gap-2'>
          {conversation.messages.map(({ role, id, text, isError, type }) => {
            const isUser = role === MessageRole.USER
            return <MessageContainer text={text} isUser={isUser} key={id} isError={isError} type={type} />
          })}
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
