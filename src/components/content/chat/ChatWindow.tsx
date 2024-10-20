import Markdown from 'markdown-to-jsx'

interface Props {
  text: string
  isUser: boolean
}

export const ChatWindow = ({ text, isUser }: Props) => (
  <Markdown className='popoverai-response-container' data-isuser={isUser} options={{ disableParsingRawHTML: true }}>
    {text}
  </Markdown>
)
