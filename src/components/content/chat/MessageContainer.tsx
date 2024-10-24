import Markdown from 'markdown-to-jsx'

interface Props {
  text: string
  isUser: boolean
  isError?: boolean
}

const getBackground = (isUser: boolean, isError?: boolean) => {
  if (isError) {
    return 'bg-red-600'
  }
  return isUser ? 'bg-neutral-600' : 'bg-neutral-700'
}

export const MessageContainer = ({ text, isUser, isError }: Props) => {
  const background = getBackground(isUser, isError)

  return (
    <div className={`${background} rounded-lg p-2`}>
      <Markdown options={{ disableParsingRawHTML: true }}>{text}</Markdown>
    </div>
  )
}
