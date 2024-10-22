import * as ScrollArea from '@radix-ui/react-scroll-area'
import { MessageRole, type Conversation } from '../../../types/types'
import { MessageContainer } from './MessageContainer'

interface Props {
  conversation: Conversation
}

export const ConversationContainer = ({ conversation }: Props) => (
  <ScrollArea.Root>
    <ScrollArea.Viewport>
      <div className='flex flex-col gap-2 h-[300px]'>
        {conversation.messages.map(({ role, id, text }) => {
          const isUser = role === MessageRole.USER
          return <MessageContainer text={text} isUser={isUser} key={id} />
        })}
      </div>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation='vertical'>
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
    <ScrollArea.Corner />
  </ScrollArea.Root>
)
