import Markdown from 'markdown-to-jsx'
import { AIApiType } from '../../../types'
import { MessageHeader } from './MessageHeader'

interface Props {
  text: string
  isUser: boolean
  isError?: boolean
  type?: AIApiType
}

const getMessageBackground = (isUser: boolean, isError?: boolean) => {
  if (isError) {
    return 'bg-error'
  }
  return isUser ? 'bg-secondary' : 'bg-secondary-hover'
}

export const MessageContainer = ({ text, isUser, isError, type }: Props) => {
  const messageBackground = getMessageBackground(isUser, isError)

  return (
    <div className={`${messageBackground} flex flex-col rounded-lg border-border border rounded-t-none`}>
      <MessageHeader text={text} isUser={isUser} type={type} />
      <div className='break-words rounded-b-md p-2'>
        <Markdown options={{ disableParsingRawHTML: true }}>{text}</Markdown>
      </div>
    </div>
  )
}
