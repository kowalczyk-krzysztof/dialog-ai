type LanguageModelSession = {
  maxTokens: number
  temperature: number
  tokensLeft: number
  tokensSoFar: number
  topK: number
  prompt: (prompt: string) => Promise<string>
  promptStreaming: (prompt: string) => Promise<ReadableStream<string>>
  destroy: () => Promise<void>
  clone: () => Promise<LanguageModelSession>
}

declare global {
  interface ReadableStream<R = unknown> {
    [Symbol.asyncIterator](): AsyncIterableIterator<R>
  }
  interface Window {
    translation: {
      createTranslator: (languagePair: {
        sourceLanguage: string
        targetLanguage: string
      }) => Promise<{ translate: (text: string) => Promise<string> }>
    }
    ai: {
      languageModel: {
        create: (options: {
          temperature?: number
          topK?: number
          systemPrompt: string
        }) => Promise<LanguageModelSession>
      }
    }
  }
}

export {}
