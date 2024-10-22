import Markdown from 'markdown-to-jsx'

interface Props {
  text: string
  isUser: boolean
}

export const ChatWindow = ({ text }: Props) => <Markdown options={{ disableParsingRawHTML: true }}>{text}</Markdown>
