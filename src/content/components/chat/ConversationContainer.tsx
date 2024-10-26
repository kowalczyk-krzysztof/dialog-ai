import {
  Root as ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from '@radix-ui/react-scroll-area'
import { MessageRole, type Conversation } from '../../types'
import { MessageContainer } from './MessageContainer'
import { useEffect, useRef } from 'react'
import { LoadingDots } from '../../../shared/components/LoadingDots'

interface Props {
  conversation: Conversation
  isResponseLoading: boolean
}

export const ConversationContainer = ({ conversation, isResponseLoading }: Props) => {
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
