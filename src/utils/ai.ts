import type { Dispatch, SetStateAction } from 'react'
import language from '../lib/language'
import { AIAvailability, AIAvailabilityString, AIType } from '../types/types'

class AIResponseError implements Error {
  public name: string

  constructor(
    public type: AIType,
    public message: string
  ) {
    this.name = 'AIResponseError'
    this.type = type
    this.message = message
  }
}

const isPromptAvailable = async () => {
  if (window?.ai?.languageModel) {
    const capabilities = await window.ai.languageModel.capabilities()
    return capabilities.available === AIAvailabilityString.READILY
  }
  return false
}

const isTranslationAvailable = () => Boolean(window?.translation)

const isSummarizationAvailable = async () => {
  if (window?.ai?.summarizer) {
    const capabilities = await window.ai.summarizer.capabilities()
    return capabilities.available === AIAvailabilityString.READILY
  }
  return false
}

export const checkAvailability = async (): Promise<AIAvailability> => {
  const prompt = await isPromptAvailable()
  const summarization = await isSummarizationAvailable()
  const translation = isTranslationAvailable()

  return {
    prompt: {
      available: prompt,
    },
    summarization: {
      available: summarization,
    },
    translation: {
      available: translation,
    },
  }
}

// TODO: Add unsupported language handling
export const getPromptStreamingResponse = async (text: string, setResponse: Dispatch<SetStateAction<string>>) => {
  const session = await window.ai.languageModel.create({
    systemPrompt: language.en.ai.explainSystemPrompt,
  })

  const promptTokens = await session.countPromptTokens(text)
  if (promptTokens > session.tokensLeft) {
    throw new AIResponseError(AIType.PROMPT, language.en.errors.ai.promptTooLong)
  }

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
