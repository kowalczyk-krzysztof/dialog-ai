interface Props {
  text: string
}

export const ChatWindow = ({ text }: Props) => <div className='popupai-response-container'>{text}</div>
