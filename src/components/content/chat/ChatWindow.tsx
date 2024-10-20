interface Props {
  text: string
  isUser: boolean
}

export const ChatWindow = ({ text, isUser }: Props) => (
  <div className='popupai-response-container' data-isuser={isUser}>
    {text}
  </div>
)
