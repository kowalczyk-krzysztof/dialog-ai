import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from '../../store'
import { Button } from '../../../shared/components/Button'
import { TranslationSettingsContainer } from './translation/TranslationSettingsContainer'
import { ChatSettingsContainer } from './chat/ChatSettingsContainer'
import type { ChatSessionHyperParameters, TranslationLanguagePair } from '../../types'

interface Props {
  isSettingsViewOpen: boolean
}

export const SettingsContainer = ({ isSettingsViewOpen }: Props) => {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const { t } = useTranslation()

  const { settings } = useContentStore(
    useShallow(state => ({
      settings: state.settings,
    }))
  )
  const [languagePair, setLanguagePair] = useState<TranslationLanguagePair>({
    sourceLanguage: settings.sourceLanguage,
    targetLanguage: settings.targetLanguage,
  })

  const [chatSessionHyperparameters, setChatSessionHyperparameters] = useState<ChatSessionHyperParameters>({
    temperature: settings.chatTemperature,
    topK: settings.chatTopK,
  })

  const saveSettingsText = t('buttons.saveSettings')
  const saveSuccessText = t('settings.saveSuccess')
  const saveErrorText = t('settings.saveError')

  useEffect(() => {
    if (!isSettingsViewOpen) {
      setError(false)
      setSuccess(false)
    }
  }, [isSettingsViewOpen])

  const handleSave = async () => {
    try {
      setError(false)
      setSuccess(false)
      await chrome.storage.sync.set({
        sourceLanguage: languagePair.sourceLanguage,
        targetLanguage: languagePair.targetLanguage,
        chatTemperature: chatSessionHyperparameters.temperature,
        chatTopK: chatSessionHyperparameters.topK,
      })
      setSuccess(true)
    } catch (e) {
      setSuccess(false)
      setError(true)
    }
  }

  const getStatusText = () => {
    if (success) {
      return saveSuccessText
    }

    if (error) {
      return saveErrorText
    }
  }

  return (
    <section
      className={isSettingsViewOpen ? 'flex h-full flex-col items-start gap-4 overflow-hidden px-4 pt-2' : 'hidden'}
    >
      <ChatSettingsContainer settings={settings} setChatSessionHyperparameters={setChatSessionHyperparameters} />
      <TranslationSettingsContainer settings={settings} languagePair={languagePair} setLanguagePair={setLanguagePair} />
      <div className='mb-10 mt-auto flex flex-col items-center justify-center self-center'>
        <Button onClick={handleSave}>{saveSettingsText}</Button>
        <p className={`h-5 ${error ? 'text-error' : 'text-success'}`}>{getStatusText()}</p>
      </div>
    </section>
  )
}
