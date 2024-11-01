import { useState } from 'react'
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

  const handleSave = async () => {
    await chrome.storage.sync.set({
      sourceLanguage: languagePair.sourceLanguage,
      targetLanguage: languagePair.targetLanguage,
      chatTemperature: chatSessionHyperparameters.temperature,
      chatTopK: chatSessionHyperparameters.topK,
    })
  }

  return (
    <section
      className={isSettingsViewOpen ? 'flex h-full flex-col items-start gap-2 overflow-hidden px-4 py-2' : 'hidden'}
    >
      <ChatSettingsContainer
        chatSessionHyperparameters={chatSessionHyperparameters}
        settings={settings}
        setChatSessionHyperparameters={setChatSessionHyperparameters}
      />
      <TranslationSettingsContainer settings={settings} languagePair={languagePair} setLanguagePair={setLanguagePair} />
      <Button className='mb-2 mt-auto self-center' onClick={handleSave}>
        {saveSettingsText}
      </Button>
    </section>
  )
}
