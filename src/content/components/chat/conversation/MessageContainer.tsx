import Markdown from 'markdown-to-jsx'
import { MessageHeader } from './MessageHeader'
import { MessageRole, type Message } from '../../../types'

interface Props extends Omit<Message, 'id'> {}

const getMessageBackground = (role: MessageRole, isError?: boolean) => {
  if (isError) {
    return 'bg-error'
  }
  return role === MessageRole.USER ? 'bg-secondary' : 'bg-secondary-hover'
}

export const MessageContainer = ({ text, role, isError, type, sourceLanguage, targetLanguage }: Props) => {
  const messageBackground = getMessageBackground(role, isError)

  return (
    <div className={`${messageBackground} flex flex-col rounded-lg border-border border rounded-t-none`}>
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
