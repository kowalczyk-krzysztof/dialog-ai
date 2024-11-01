import { create } from 'zustand'
import {
  type AIApiAvailability,
  type ChatSession,
  type Conversation,
  type SummarizationSession,
  type ExtensionSettings,
  SupportedLanguages,
  AIApiType,
} from './types'
import { DEFAULT_CHAT_TEMPERATURE, DEFAULT_CHAT_TOPK } from '../../constants'

const defaultAIApiAvailability: AIApiAvailability = {
  [AIApiType.CHAT]: {
    available: false,
  },
  [AIApiType.SUMMARIZATION]: {
    available: false,
  },
  [AIApiType.TRANSLATION]: {
    available: false,
  },
}

const defaultSettings: ExtensionSettings = {
  sourceLanguage: SupportedLanguages.ENGLISH,
  targetLanguage: SupportedLanguages.SPANISH,
  chatTopK: DEFAULT_CHAT_TOPK,
  chatTemperature: DEFAULT_CHAT_TEMPERATURE,
  loading: false,
}

interface ContentStore {
  isResponseLoading: boolean
  isStreamingResponse: boolean
  conversation: Conversation
  chatSession: ChatSession | undefined
  summarizationSession: SummarizationSession | undefined
  aiApiAvailability: AIApiAvailability
  userInput: string
  chatResponseAbortController: AbortController | undefined
  summarizationResponseAbortController: AbortController | undefined
  translationResponseAbortController: AbortController | undefined
  settings: ExtensionSettings
  areControlsDisabled: () => boolean
  setIsResponseLoading: (loading: boolean) => void
  setIsStreamingResponse: (streaming: boolean) => void
  setConversation: (updateFn: (conversation: Conversation) => Conversation) => void
  setChatSession: (session: ChatSession | undefined) => void
  setSummarizationSession: (session: SummarizationSession | undefined) => void
  setAiApiAvailability: (availability: AIApiAvailability) => void
  setUserInput: (input: string) => void
  setChatResponseAbortController: (controller: AbortController | undefined) => void
  setSummarizationResponseAbortController: (controller: AbortController | undefined) => void
  setTranslationResponseAbortController: (controller: AbortController | undefined) => void
  reset: () => void
  fetchSettings: () => Promise<void>
  setSettings: (updateFn: (settings: ExtensionSettings) => ExtensionSettings) => void
}

export const useContentStore = create<ContentStore>((set, get) => ({
  isResponseLoading: false,
  isStreamingResponse: false,
  conversation: { id: window.crypto.randomUUID(), messages: [] },
  chatSession: undefined,
  summarizationSession: undefined,
  aiApiAvailability: defaultAIApiAvailability,
  userInput: '',
  chatResponseAbortController: undefined,
  summarizationResponseAbortController: undefined,
  translationResponseAbortController: undefined,
  settings: defaultSettings,
  areControlsDisabled: () => {
    const { isResponseLoading, isStreamingResponse, userInput } = get()
    return isResponseLoading || isStreamingResponse || userInput.trim().length === 0
  },
  setIsResponseLoading: loading => set({ isResponseLoading: loading }),
  setIsStreamingResponse: streaming => set({ isStreamingResponse: streaming }),
  setConversation: updateFn => set(state => ({ conversation: updateFn(state.conversation) })),
  setChatSession: session => set({ chatSession: session }),
  setSummarizationSession: session => set({ summarizationSession: session }),
  setAiApiAvailability: availability => set({ aiApiAvailability: availability }),
  setUserInput: input => set(() => ({ userInput: input })),
  setChatResponseAbortController: controller => set({ chatResponseAbortController: controller }),
  setSummarizationResponseAbortController: controller => set({ summarizationResponseAbortController: controller }),
  setTranslationResponseAbortController: controller => set({ translationResponseAbortController: controller }),
  reset: async () => {
    const {
      chatSession,
      summarizationSession,
      aiApiAvailability,
      chatResponseAbortController,
      summarizationResponseAbortController,
      translationResponseAbortController,
    } = get()

    if (chatResponseAbortController) {
      chatResponseAbortController.abort()
    }

    if (summarizationResponseAbortController) {
      summarizationResponseAbortController.abort()
    }

    if (translationResponseAbortController) {
      translationResponseAbortController.abort()
    }

    if (chatSession && typeof chatSession.destroy === 'function') {
      await chatSession.destroy()
    }

    if (summarizationSession && typeof summarizationSession.destroy === 'function') {
      await summarizationSession.destroy()
    }

    set({
      isResponseLoading: false,
      isStreamingResponse: false,
      conversation: {
        id: window.crypto.randomUUID(),
        messages: [],
      } as Conversation,
      chatSession: undefined,
      summarizationSession: undefined,
      aiApiAvailability: aiApiAvailability,
      userInput: '',
      chatResponseAbortController: undefined,
      summarizationResponseAbortController: undefined,
      translationResponseAbortController: undefined,
    })
  },
  fetchSettings: async () => {
    const { setSettings, setChatSession } = get()
    try {
      setSettings(settings => ({ ...settings, loading: true }))
      const response = await chrome.storage.sync.get([
        'sourceLanguage',
        'targetLanguage',
        'chatTopK',
        'chatTemperature',
      ])

      if (response) {
        if (response.chatTopK || response.chatTemperature) {
          setChatSession(undefined)
        }

        setSettings(() => ({
          sourceLanguage: response.sourceLanguage || defaultSettings.sourceLanguage,
          targetLanguage: response.targetLanguage || defaultSettings.targetLanguage,
          chatTopK: response.chatTopK || defaultSettings.chatTopK,
          chatTemperature: response.chatTemperature || defaultSettings.chatTemperature,
          loading: false,
        }))
      }
      // eslint-disable-next-line no-empty
    } catch (e) {
    } finally {
      setSettings(settings => ({ ...settings, loading: false }))
    }
  },
  setSettings: updateFn => set(state => ({ settings: updateFn(state.settings) })),
}))
