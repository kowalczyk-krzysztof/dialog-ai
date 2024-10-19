import { Dispatch, SetStateAction } from 'react'

// TODO: Add unsupported language handling
export const getPromptStreamingResponse = async (text: string, setResponse: Dispatch<SetStateAction<string>>) => {
  const session = await window.ai.languageModel.create({
    systemPrompt: `
    You are a helpful assistant. You have access to the following tools. Explain the text you are given in a short an concise manner.
  `,
  })
  console.log(session)
  const stream = await session.promptStreaming(text)
  for await (const chunk of stream) {
    setResponse(chunk.trim())
  }
  await session.destroy()
}
