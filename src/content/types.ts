import { DialogContent } from '@radix-ui/react-dialog'
import { ComponentProps } from 'react'

export interface ExtensionSettings {
  sourceLanguage: SupportedLanguages
  targetLanguage: SupportedLanguages
  chatTemperature: number
  chatTopK: number
  loading: boolean
}

export enum AIApiType {
  CHAT = 'chat',
  TRANSLATION = 'translation',
  SUMMARIZATION = 'summarization',
}

export enum AIApiAvailabilityString {
  READILY = 'readily',
  AFTER_DOWNLOAD = 'after-download',
  NO = 'no',
}

export interface AIApiAvailability {
  [AIApiType.CHAT]: boolean
  [AIApiType.SUMMARIZATION]: boolean
  [AIApiType.TRANSLATION]: boolean
}

export enum InitialChatRole {
  USER = 'user',
  SYSTEM = 'system',
}
export interface InitialChatPrompt {
  role: InitialChatRole
  content: string
}

export interface AISessionOptions {
  signal?: AbortSignal
}

export interface ChatSessionHyperParameters {
  temperature?: number
  topK?: number
}

export interface ChatSessionOptions extends AISessionOptions, ChatSessionHyperParameters {
  systemPrompt?: string
  initialPrompts?: InitialChatPrompt[]
}

export interface BaseCapabilities {
  available: AIApiAvailabilityString
}

export interface ChatCapabilities extends BaseCapabilities {
  defaultTemperature: number
  defaultTopK: number
  maxTopK: number
  maxTemperature: number
}

export interface ChatSession {
  maxTokens: number
  temperature: number
  tokensLeft: number
  tokensSoFar: number
  topK: number
  prompt: (prompt: string, options?: AISessionOptions) => Promise<string>
  promptStreaming: (prompt: string, options?: AISessionOptions) => Promise<ReadableStream<string>>
  destroy: () => Promise<void>
  clone: (options?: AISessionOptions) => Promise<ChatSession>
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

export interface SummarizationSession {
  summarize: (text: string, options?: AISessionOptions) => Promise<string>
  summarizeStreaming: (text: string, options?: AISessionOptions) => Promise<ReadableStream<string>>
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
  targetLanguage?: SupportedLanguages
  sourceLanguage?: SupportedLanguages
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

export type FocusOutsideEvent = Parameters<NonNullable<ComponentProps<typeof DialogContent>['onFocusOutside']>>[0]
