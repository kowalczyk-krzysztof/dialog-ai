import * as ScrollArea from '@radix-ui/react-scroll-area'
import { MessageRole, type Conversation } from '../../../types/types'
import { MessageContainer } from './MessageContainer'
import { useEffect, useRef } from 'react'
import { LoadingDots } from '../../shared/LoadingDots'

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
    <ScrollArea.Root className='w-full'>
      <ScrollArea.Viewport ref={scrollableAreaRef}>
        <div className='my-2 flex h-72 flex-col gap-2'>
          {conversation.messages.map(({ role, id, text, isError, type }) => {
            const isUser = role === MessageRole.USER
            return <MessageContainer text={text} isUser={isUser} key={id} isError={isError} type={type} />
          })}
          {isResponseLoading && <LoadingDots />}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation='vertical'>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  )
}
