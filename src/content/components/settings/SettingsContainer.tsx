import { useShallow } from 'zustand/react/shallow'
import { Select } from '../../../shared/components/Select'
import { useContentStore } from '../../store'
import { SupportedLanguages } from '../../types'
import { getLanguageItems, mapLanguageToSelectOption } from '../../utils/ai'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Button } from '../../../shared/components/Button'

interface Props {
  isSettingsViewOpen: boolean
}

// TODO: Loading state when fetching settings
export const SettingsContainer = ({ isSettingsViewOpen }: Props) => {
  const { t } = useTranslation()
  const {
    settings: { sourceLanguage, targetLanguage, loading },
  } = useContentStore(
    useShallow(state => ({
      settings: state.settings,
    }))
  )

  const [currentSourceLanguage, setCurrentSourceLanguage] = useState<SupportedLanguages>(sourceLanguage)
  const [currentTargetLanguage, setCurrentTargetLanguage] = useState<SupportedLanguages>(targetLanguage)

  const isEnglish = (value: string) => value === SupportedLanguages.ENGLISH

  const settingsTitleText = t('settings.title')
  const sourceLanguageText = t('settings.sourceLanguage')
  const targetLanguageText = t('settings.targetLanguage')
  const saveChangesText = t('buttons.saveChanges')
  const sourceLanguageId = 'source-language'
  const targetLanguageId = 'target-language'

  const languageItems = getLanguageItems()

  const sourceLanguageItem = mapLanguageToSelectOption(currentSourceLanguage)
  const targetLanguageItem = mapLanguageToSelectOption(currentTargetLanguage)

  const handleSelectSourceLanguage = (value: string) => {
    if (isEnglish(value)) {
      setCurrentTargetLanguage(currentSourceLanguage)
    }
    setCurrentSourceLanguage(value as SupportedLanguages)
  }

  const handleSelectTargetLanguage = (value: string) => {
    if (isEnglish(value)) {
      setCurrentSourceLanguage(currentTargetLanguage)
    }
    setCurrentTargetLanguage(value as SupportedLanguages)
  }

  const handleSave = async () => {
    await chrome.storage.sync.set({
      sourceLanguage: currentSourceLanguage,
      targetLanguage: currentTargetLanguage,
    })
  }

  return (
    <div className={`${isSettingsViewOpen ? 'flex flex-col' : 'hidden'} gap-2 items-center`}>
      <h3 className='select-none'>{settingsTitleText}</h3>
      <label className='text-primary hover:text-primary-hover' htmlFor={sourceLanguageId}>
        {sourceLanguageText}
      </label>
      <Select
        id={sourceLanguageId}
        items={languageItems}
        value={sourceLanguageItem}
        onChange={handleSelectSourceLanguage}
        disabled={isEnglish(currentSourceLanguage)}
      />
      <label htmlFor={targetLanguageId} className='text-primary hover:text-primary-hover'>
        {targetLanguageText}
      </label>
      <Select
        id={targetLanguageId}
        items={languageItems}
        value={targetLanguageItem}
        onChange={handleSelectTargetLanguage}
        disabled={isEnglish(currentTargetLanguage)}
      />
      <Button className='mt-4' onClick={handleSave}>
        {saveChangesText}
      </Button>
    </div>
  )
}
