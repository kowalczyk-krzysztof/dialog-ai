import { useContentStore } from '../store'
import i18n from '../../i118n'
import { createSystemMessage, createUserMessage } from '../utils/ai'
import { type TranslationLanguagePair, type TranslationModelSession, AIApiType, SupportedLanguages } from '../types'

export const nonEnglishLanguages = Object.values(SupportedLanguages).filter(
  language => language !== SupportedLanguages.ENGLISH
) as Array<SupportedLanguages>

const isValidTranslationLanguagePair = (languagePair: TranslationLanguagePair) => {
  const { sourceLanguage, targetLanguage } = languagePair

  if (sourceLanguage === targetLanguage) return false
  if (sourceLanguage === SupportedLanguages.ENGLISH) {
    return nonEnglishLanguages.includes(targetLanguage)
  }
  if (targetLanguage === SupportedLanguages.ENGLISH) {
    return nonEnglishLanguages.includes(sourceLanguage)
  }
}

const createTranslator = async (
  languagePair: TranslationLanguagePair
): Promise<TranslationModelSession | undefined> => {
  const { setConversation } = useContentStore.getState()
  try {
    const translator = await window.translation.createTranslator(languagePair)
    return translator
  } catch (e) {
    const couldNotCreateTranslatorText = i18n.t('errors.ai.couldNotCreateTranslator')
    setConversation(conversation =>
      createSystemMessage({
        conversation,
        text: couldNotCreateTranslatorText,
        isError: true,
        type: AIApiType.TRANSLATION,
      })
    )
  }
}

export const getTranslation = async (languagePair: TranslationLanguagePair) => {
  const { setConversation, userInput, setUserInput, setTranslationResponseAbortController } = useContentStore.getState()
  const storedUserInput = userInput
  setUserInput('')
  setConversation(conversation => createUserMessage({ conversation, text: storedUserInput }))
  if (!window.translation) {
    const translationNotEnabledText = i18n.t('errors.ai.translationNotEnabled')
    setConversation(conversation =>
      createSystemMessage({
        conversation,
        text: translationNotEnabledText,
        isError: true,
        type: AIApiType.TRANSLATION,
      })
    )
    return
  }
  const reponseId = window.crypto.randomUUID()
  const isValidPair = isValidTranslationLanguagePair(languagePair)

  if (!isValidPair) {
    const invalidLanguagePairText = i18n.t('errors.ai.translationNotEnabled')
    setConversation(conversation =>
      createSystemMessage({
        conversation,
        text: invalidLanguagePairText,
        isError: true,
        type: AIApiType.TRANSLATION,
      })
    )
    return
  }

  const isTranslationDownloadedForLanguagePair = await window.translation.canTranslate(languagePair)

  if (!isTranslationDownloadedForLanguagePair) {
    const translationNotDownloadedText = i18n.t('errors.ai.translationNotDownloaded')
    setConversation(conversation =>
      createSystemMessage({
        conversation,
        text: translationNotDownloadedText,
        isError: true,
        type: AIApiType.TRANSLATION,
      })
    )
    return
  }

  const translator = await createTranslator(languagePair)

  if (!translator) {
    return
  }

  try {
    const controller = new AbortController()
    const translation = await translator.translate(storedUserInput, { signal: controller.signal })
    setTranslationResponseAbortController(controller)
    setConversation(conversation =>
      createSystemMessage({ conversation, text: translation, id: reponseId, type: AIApiType.TRANSLATION })
    )
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      return
    }
    const unknownError = i18n.t('errors.ai.unknownError')
    setConversation(conversation =>
      createSystemMessage({
        conversation,
        text: unknownError,
        id: reponseId,
        type: AIApiType.TRANSLATION,
        isError: true,
      })
    )
  } finally {
    setTranslationResponseAbortController(undefined)
  }
}
