interface Props {
  response: string
}

export const ChatWindow = ({ response }: Props) => <div className="popupai-chat-container">{response}</div>
