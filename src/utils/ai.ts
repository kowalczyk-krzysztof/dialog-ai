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

// TODO: Add multi-language support
// TODO: Add ready checks
export const getTranslation = async (text: string, setResponse: Dispatch<SetStateAction<string>>) => {
  const languagePair = {
    sourceLanguage: 'en', // Or detect the source language with the Language Detection API
    targetLanguage: 'es',
  }

  const translator = await window.translation.createTranslator(languagePair)
  const translation = await translator.translate(text)

  setResponse(translation)
}

export const getSummary = async (text: string, setResponse: Dispatch<SetStateAction<string>>) => {
  const summarizer = await window.ai.summarizer.create()

  const summary = await summarizer.summarize(text)

  setResponse(summary)

  await summarizer.destroy()
}
