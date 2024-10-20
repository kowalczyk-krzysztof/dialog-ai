export enum AIAvailabilityString {
  READILY = 'readily',
  AFTER_DOWNLOAD = 'after-download',
  NO = 'no',
}

export enum AIType {
  PROMPT = 'prompt',
  SUMMARIZATION = 'summarization',
  TRANSLATION = 'translation',
}

export interface AIAvailability {
  prompt: {
    available: boolean
    error?: string
  }
  summarization: {
    available: boolean
    error?: string
  }
  translation: {
    available: boolean
    error?: string
  }
}

export interface BaseCapabilities {
  available: AIAvailabilityString
}
export interface PromptCapabilities extends BaseCapabilities {
  defaultTemperature: number
  defaultTopK: number
  maxTopK: number
}

export interface LanguageModelSession {
  maxTokens: number
  temperature: number
  tokensLeft: number
  tokensSoFar: number
  topK: number
  prompt: (prompt: string) => Promise<string>
  promptStreaming: (prompt: string) => Promise<ReadableStream<string>>
  destroy: () => Promise<void>
  clone: () => Promise<LanguageModelSession>
  countPromptTokens: (prompt: string) => Promise<number>
}

export interface SummarizeModelSession {
  summarize: (text: string) => Promise<string>
  destroy: () => Promise<void>
}

export interface TranslationLanguagePair {
  sourceLanguage: SupportedLanguages
  targetLanguage: SupportedLanguages
}

export enum MessageRole {
  USER = 'user',
  SYSTEM = 'system',
}

export interface Message {
  id: string
  text: string
  role: MessageRole
}

export interface Conversation {
  id: string
  messages: Message[]
}

export enum SupportedLanguages {
  ARABIC = 'ar',
  BENGALI = 'bn',
  HINDI = 'hi',
  ENGLISH = 'en',
  GERMAN = 'de',
  SPANISH = 'es',
  FRENCH = 'fr',
  ITALIAN = 'it',
  DUTCH = 'nl',
  POLISH = 'pl',
  PORTUGUESE = 'pt',
  RUSSIAN = 'ru',
  JAPANESE = 'ja',
  KOREAN = 'ko',
  THAI = 'th',
  TURKISH = 'tr',
  VIETNAMESE = 'vi',
  CHINESE_SIMPLIFIED = 'zh',
  CHINESE_TRADITIONAL = 'zh-Hant',
}
