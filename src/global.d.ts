import type {
  AIApiAvailabilityString,
  AISessionOptions,
  BaseCapabilities,
  LanguageDetectorSession,
  ChatSession,
  ChatCapabilities,
  TranslationLanguagePair,
  TranslationModelSession,
  SummarizationSession,
  ChatSessionOptions,
} from './content/types'

declare global {
  interface ReadableStream<R = unknown> {
    [Symbol.asyncIterator](): AsyncIterableIterator<R>
  }
  interface Window {
    // https://github.com/WICG/translation-api (WIP)
    languageDetector: {
      create: (options?: AISessionOptions) => Promise<LanguageDetectorSession>
      capabilities: () => Promise<BaseCapabilities>
    }
    // https://github.com/WICG/translation-api (WIP)
    translation: {
      createTranslator: (languagePair: TranslationLanguagePair) => Promise<TranslationModelSession>
      canTranslate: (languagePair: TranslationLanguagePair) => Promise<AIApiAvailabilityString>
    }
    // https://github.com/explainers-by-googlers/prompt-api (WIP)
    ai: {
      languageModel: {
        create: (options?: ChatSessionOptions) => Promise<ChatSession>
        capabilities: () => Promise<ChatCapabilities>
      }
      summarizer: {
        create: (options?: AISessionOptions) => Promise<SummarizationSession>
        capabilities: () => Promise<BaseCapabilities>
      }
    }
  }
}

export {}
