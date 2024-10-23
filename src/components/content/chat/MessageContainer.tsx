import Markdown from 'markdown-to-jsx'

interface Props {
  text: string
  isUser: boolean
}

export const MessageContainer = ({ text, isUser }: Props) => (
  <div className={`${isUser ? 'bg-neutral-600' : 'bg-neutral-700'} rounded-lg p-2`}>
    <Markdown options={{ disableParsingRawHTML: true }}>{text}</Markdown>
  </div>
)
