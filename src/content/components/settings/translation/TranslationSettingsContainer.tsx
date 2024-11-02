import { type Dispatch, type SetStateAction, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from '../../../../shared/components/Select'
import { getLanguageItems, mapLanguageToSelectOption } from '../../../utils/translation'
import type { ExtensionSettings, SupportedLanguages, TranslationLanguagePair } from '../../../types'

interface Props {
  settings: ExtensionSettings
  languagePair: TranslationLanguagePair
  setLanguagePair: Dispatch<SetStateAction<TranslationLanguagePair>>
}

export const TranslationSettingsContainer = ({ settings, languagePair, setLanguagePair }: Props) => {
  const { t } = useTranslation()

  useEffect(() => {
    setLanguagePair({ sourceLanguage: settings.sourceLanguage, targetLanguage: settings.targetLanguage })
  }, [settings, setLanguagePair])

  const sourceLanguageText = t('settings.sourceLanguage')
  const targetLanguageText = t('settings.targetLanguage')
  const translationSectionTitleText = t('settings.sections.translation')

  const sourceLanguageId = 'translation-settings-source-language'
  const targetLanguageId = 'translation-settings-target-language'

  const sourceLanguageItems = getLanguageItems().map(item => ({
    ...item,
    disabled: item.value === languagePair.targetLanguage,
  }))
  const targetLanguageItems = getLanguageItems().map(item => ({
    ...item,
    disabled: item.value === languagePair.sourceLanguage,
  }))

  const sourceLanguageItem = mapLanguageToSelectOption(languagePair.sourceLanguage)
  const targetLanguageItem = mapLanguageToSelectOption(languagePair.targetLanguage)

  const handleSelectSourceLanguage = (value: string) => {
    setLanguagePair(pair => ({ ...pair, sourceLanguage: value as SupportedLanguages }))
  }

  const handleSelectTargetLanguage = (value: string) => {
    setLanguagePair(pair => ({ ...pair, targetLanguage: value as SupportedLanguages }))
  }

  return (
    <section className='flex flex-col'>
      <h3 className='select-none text-lg'>{translationSectionTitleText}</h3>
      <ul className='flex flex-col gap-2'>
        <li className='flex items-center gap-2'>
          <label className='cursor-pointer text-primary hover:text-primary-hover' htmlFor={sourceLanguageId}>
            {sourceLanguageText}
          </label>
          <Select
            id={sourceLanguageId}
            items={sourceLanguageItems}
            value={sourceLanguageItem}
            onChange={handleSelectSourceLanguage}
          />
        </li>
        <li className='flex items-center gap-2'>
          <label className='cursor-pointer text-primary hover:text-primary-hover' htmlFor={targetLanguageId}>
            {targetLanguageText}
          </label>
          <Select
            id={targetLanguageId}
            items={targetLanguageItems}
            value={targetLanguageItem}
            onChange={handleSelectTargetLanguage}
          />
        </li>
      </ul>
    </section>
  )
}
