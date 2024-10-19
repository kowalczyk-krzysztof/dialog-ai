import { Dispatch, SetStateAction, useState } from 'react'
import { getPromptStreamingResponse } from '../../utils/ai'

interface Props {
  promptText: string
  setResponse: Dispatch<SetStateAction<string>>
}

export const ExplainButton = ({ setResponse, promptText }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGetResponse = async () => {
    setIsLoading(true)
    await getPromptStreamingResponse(promptText, setResponse)
    setIsLoading(false)
  }

  return (
    <button disabled={isLoading} className='popupai-content-button' onClick={handleGetResponse}>
      Explain
    </button>
  )
}
