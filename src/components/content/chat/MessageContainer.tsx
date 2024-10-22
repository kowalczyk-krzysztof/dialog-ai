import Markdown from 'markdown-to-jsx'

interface Props {
  text: string
  isUser: boolean
}

export const MessageContainer = ({ text, isUser }: Props) => (
  <div className={`${isUser ? 'bg-slate-400' : 'bg-slate-500'} p-2`}>
    <Markdown options={{ disableParsingRawHTML: true }}>{text}</Markdown>
  </div>
)
