import {
  type AIApiAvailability,
  type Conversation,
  AIApiAvailabilityString,
  AIApiType,
  MessageRole,
  SupportedLanguages,
} from '../../content/types'

interface UserMessageParams {
  conversation: Conversation
  text: string
}
interface SystemMessageParams extends UserMessageParams {
  type?: AIApiType
  isError?: boolean
  id?: string
  sourceLanguage?: SupportedLanguages
  targetLanguage?: SupportedLanguages
}

export const createSystemMessage = ({
  conversation,
  text,
  isError = false,
  id,
  type,
  sourceLanguage,
  targetLanguage,
}: SystemMessageParams) => {
  if (id) {
    if (!conversation.messages.find(message => message.id === id)) {
      return {
        ...conversation,
        messages: [
          ...conversation.messages,
          {
            id,
            text,
            type,
            role: MessageRole.SYSTEM,
            sourceLanguage,
            targetLanguage,
            isError,
          },
        ],
      }
    }

    return {
      ...conversation,
      messages: conversation.messages.map(message => (message.id === id ? { ...message, text, isError } : message)),
    }
  }

  return {
    ...conversation,
    messages: [
      ...conversation.messages,
      {
        id: window.crypto.randomUUID(),
        text,
        isError,
        role: MessageRole.SYSTEM,
        type,
        sourceLanguage,
        targetLanguage,
      },
    ],
  }
}

export const createUserMessage = ({ conversation, text }: UserMessageParams) => ({
  ...conversation,
  messages: [
    ...conversation.messages,
    {
      id: window.crypto.randomUUID(),
      text,
      role: MessageRole.USER,
    },
  ],
})

const isChatAvailable = async () => {
  if (window?.ai?.languageModel) {
    const capabilities = await window.ai.languageModel.capabilities()
    return capabilities.available === AIApiAvailabilityString.READILY
  }
  return false
}

const isTranslationAvailable = () => Boolean(window?.translation)

const isSummarizationAvailable = async () => {
  if (window?.ai?.summarizer) {
    const capabilities = await window.ai.summarizer.capabilities()
    return capabilities.available === AIApiAvailabilityString.READILY
  }
  return false
}

export const checkAiApiAvailability = async (): Promise<AIApiAvailability> => {
  const chat = await isChatAvailable()
  const summarization = await isSummarizationAvailable()
  const translation = isTranslationAvailable()

  return {
    chat,
    summarization,
    translation,
  }
}
