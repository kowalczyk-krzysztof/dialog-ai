import Markdown from 'markdown-to-jsx'
import { MessageHeader } from './MessageHeader'
import { MessageRole, type Message } from '../../../types'

const getMessageBackground = (role: MessageRole, isError?: boolean) => {
  if (isError) {
    return 'bg-error'
  }
  return role === MessageRole.USER ? 'bg-secondary' : 'bg-secondary-hover'
}

export const MessageContainer = ({
  text,
  role,
  isError,
  type,
  sourceLanguage,
  targetLanguage,
}: Omit<Message, 'id'>) => {
  const messageBackground = getMessageBackground(role, isError)

  return (
    <div role='status' className={`${messageBackground} flex flex-col rounded-lg rounded-t-none border border-border`}>
      <MessageHeader
        text={text}
        role={role}
        isError={isError}
        type={type}
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
      />
      <div className='break-words rounded-b-md p-2'>
        <Markdown options={{ disableParsingRawHTML: true }}>{text}</Markdown>
      </div>
    </div>
  )
}
