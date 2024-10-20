import {
  AIAvailabilityString,
  BaseCapabilities,
  LanguageModelSession,
  PromptCapabilities,
  TranslationLanguagePair,
} from './types'

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
      canTranslate: (languagePair: TranslationLanguagePair) => Promise<AIAvailabilityString>
    }
    ai: {
      languageModel: {
        create: (options: {
          temperature?: number
          topK?: number
          systemPrompt: string
        }) => Promise<LanguageModelSession>
        capabilities: () => Promise<PromptCapabilities>
      }
      summarizer: {
        create: () => Promise<SummarizeModelSession>
        capabilities: () => Promise<BaseCapabilities>
      }
    }
  }
}

export {}
