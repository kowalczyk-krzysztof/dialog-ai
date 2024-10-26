import { DialogContent } from '@radix-ui/react-dialog'
import { ComponentProps } from 'react'

export enum AIApiType {
  PROMPT = 'prompt',
  TRANSLATION = 'translation',
  SUMMARIZATION = 'summarization',
}

export enum AIApiAvailabilityString {
  READILY = 'readily',
  AFTER_DOWNLOAD = 'after-download',
  NO = 'no',
}

export interface AIApiAvailability {
  [AIApiType.PROMPT]: {
    available: boolean
    error?: string
  }
  [AIApiType.SUMMARIZATION]: {
    available: boolean
    error?: string
  }
  [AIApiType.TRANSLATION]: {
    available: boolean
    error?: string
  }
}

export enum InitialPromptRole {
  USER = 'user',
  SYSTEM = 'system',
  ASSISTANT = 'assistant',
}
export interface InitialPrompt {
  role: InitialPromptRole
  content: string
}

export interface AISessionOptions {
  signal: AbortSignal
}

export interface PromptSessionOptions extends AISessionOptions {
  temperature?: number
  topK?: number
  systemPrompt?: string
  initialPrompts?: InitialPrompt[]
}

export interface BaseCapabilities {
  available: AIApiAvailabilityString
}

export interface PromptCapabilities extends BaseCapabilities {
  defaultTemperature: number
  defaultTopK: number
  maxTopK: number
  maxTemperature: number
}

export interface LanguageModelSession {
  maxTokens: number
  temperature: number
  tokensLeft: number
  tokensSoFar: number
  topK: number
  prompt: (prompt: string, options?: AISessionOptions) => Promise<string>
  promptStreaming: (prompt: string, options?: AISessionOptions) => Promise<ReadableStream<string>>
  destroy: () => Promise<void>
  clone: (options?: AISessionOptions) => Promise<LanguageModelSession>
  countPromptTokens: (prompt: string) => Promise<number>
}

export interface TranslationModelSession {
  translate: (text: string, options?: AISessionOptions) => Promise<string>
  translateStreaming: (prompt: string, options?: AISessionOptions) => Promise<ReadableStream<string>>
  destroy: () => Promise<void>
}

export interface LanguageDetectorSession {
  detect: (text: string) => Promise<string>
}

export interface SummarizationModelSession {
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
  isError?: boolean
  type?: AIApiType
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

export interface TextSelection {
  text: string
  bounds: DOMRect
}

export type PointerDownOutsideEvent = Parameters<
  NonNullable<ComponentProps<typeof DialogContent>['onPointerDownOutside']>
>[0]
