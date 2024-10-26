import type {
  AIApiAvailabilityString,
  AISessionOptions,
  BaseCapabilities,
  LanguageDetectorSession,
  LanguageModelSession,
  ChatCapabilities,
  TranslationLanguagePair,
  TranslationModelSession,
  SummarizationModelSession,
  ChatSessionOptions,
} from './types'

declare global {
  interface ReadableStream<R = unknown> {
    [Symbol.asyncIterator](): AsyncIterableIterator<R>
  }
  interface Window {
    // https://github.com/WICG/translation-api (WIP)
    languageDetector: {
      capabilities: () => Promise<BaseCapabilities>
      create: (options?: AISessionOptions) => Promise<LanguageDetectorSession>
    }
    // https://github.com/WICG/translation-api (WIP)
    translation: {
      createTranslator: (languagePair: TranslationLanguagePair) => Promise<TranslationModelSession>
      canTranslate: (languagePair: TranslationLanguagePair) => Promise<AIApiAvailabilityString>
    }
    // https://github.com/explainers-by-googlers/prompt-api (WIP)
    ai: {
      languageModel: {
        create: (options?: ChatSessionOptions) => Promise<LanguageModelSession>
        capabilities: () => Promise<ChatCapabilities>
      }
      summarizer: {
        create: (options?: AISessionOptions) => Promise<SummarizationModelSession>
        capabilities: () => Promise<BaseCapabilities>
      }
    }
  }
}

export {}
