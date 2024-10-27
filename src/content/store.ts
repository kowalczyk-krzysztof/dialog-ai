import { create } from 'zustand'
import { AIApiAvailability, AIApiType, ChatSession, Conversation, SummarizationSession } from './types'

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

interface ContentStore {
  isResponseLoading: boolean
  isStreamingResponse: boolean
  conversation: Conversation
  chatSession: ChatSession | undefined
  summarizationSession: SummarizationSession | undefined
  aiApiAvailability: AIApiAvailability
  userInput: string

  setIsResponseLoading: (loading: boolean) => void
  setIsStreamingResponse: (streaming: boolean) => void
  setConversation: (updateFn: (conversation: Conversation) => Conversation) => void
  setChatSession: (session: ChatSession | undefined) => void
  setSummarizationSession: (session: SummarizationSession | undefined) => void
  setAiApiAvailability: (availability: AIApiAvailability) => void
  setUserInput: (input: string) => void
  reset: () => void
}

export const useContentStore = create<ContentStore>((set, get) => ({
  isResponseLoading: false,
  isStreamingResponse: false,
  conversation: { id: window.crypto.randomUUID(), messages: [] },
  chatSession: undefined,
  summarizationSession: undefined,
  aiApiAvailability: defaultAIApiAvailability,
  userInput: '',
  setIsResponseLoading: loading => set({ isResponseLoading: loading }),
  setIsStreamingResponse: streaming => set({ isStreamingResponse: streaming }),
  setConversation: updateFn => set(state => ({ conversation: updateFn(state.conversation) })),
  setChatSession: session => set({ chatSession: session }),
  setSummarizationSession: session => set({ summarizationSession: session }),
  setAiApiAvailability: availability => set({ aiApiAvailability: availability }),
  setUserInput: input => set(() => ({ userInput: input })),
  reset: () => {
    const { chatSession, summarizationSession, aiApiAvailability } = get() // Access the current chatSession state

    if (chatSession && typeof chatSession.destroy === 'function') {
      chatSession.destroy()
    }

    if (summarizationSession && typeof summarizationSession.destroy === 'function') {
      summarizationSession.destroy()
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
    })
  },
}))
