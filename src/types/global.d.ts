import type {
  AIAvailabilityString,
  AISessionOptions,
  BaseCapabilities,
  LanguageDetectorSession,
  LanguageModelSession,
  PromptCapabilities,
  TranslationLanguagePair,
  TranslationModelSession,
  SummarizationModelSession,
  PromptSessionOptions,
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
      canTranslate: (languagePair: TranslationLanguagePair) => Promise<AIAvailabilityString>
    }
    // https://github.com/explainers-by-googlers/prompt-api (WIP)
    ai: {
      languageModel: {
        create: (options?: PromptSessionOptions) => Promise<LanguageModelSession>
        capabilities: () => Promise<PromptCapabilities>
      }
      summarizer: {
        create: (options?: AISessionOptions) => Promise<SummarizationModelSession>
        capabilities: () => Promise<BaseCapabilities>
      }
    }
  }
}

export {}
