import { type Dispatch, type SetStateAction, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from '../../../../shared/components/Select'
import { getLanguageItems, isEnglish, mapLanguageToSelectOption } from '../../../utils/ai'
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
  }, [settings])

  const sourceLanguageText = t('settings.sourceLanguage')
  const targetLanguageText = t('settings.targetLanguage')
  const translationSectionTitleText = t('settings.sections.translation')

  const sourceLanguageId = 'source-language'
  const targetLanguageId = 'target-language'

  const languageItems = getLanguageItems()

  const sourceLanguageItem = mapLanguageToSelectOption(languagePair.sourceLanguage)
  const targetLanguageItem = mapLanguageToSelectOption(languagePair.targetLanguage)
  const isSourceDisabled = isEnglish(languagePair.sourceLanguage)
  const isTargetDisabled = isEnglish(languagePair.targetLanguage)

  const handleSelectSourceLanguage = (value: string) => {
    if (isEnglish(value)) {
      setLanguagePair(pair => ({ sourceLanguage: value as SupportedLanguages, targetLanguage: pair.sourceLanguage }))
    } else {
      setLanguagePair(pair => ({ ...pair, sourceLanguage: value as SupportedLanguages }))
    }
  }

  const handleSelectTargetLanguage = (value: string) => {
    if (isEnglish(value)) {
      setLanguagePair(pair => ({ targetLanguage: value as SupportedLanguages, sourceLanguage: pair.targetLanguage }))
    } else {
      setLanguagePair(pair => ({ ...pair, targetLanguage: value as SupportedLanguages }))
    }
  }

  return (
    <section className='flex flex-col'>
      <h3 className='select-none text-lg'>{translationSectionTitleText}</h3>
      <ul className='flex gap-2 flex-col'>
        <li className='flex gap-2'>
          <label className='text-primary hover:text-primary-hover' htmlFor={sourceLanguageId}>
            {sourceLanguageText}
          </label>
          <Select
            id={sourceLanguageId}
            items={languageItems}
            value={sourceLanguageItem}
            disabled={isSourceDisabled}
            onChange={handleSelectSourceLanguage}
          />
        </li>
        <li className='flex gap-2'>
          <label htmlFor={targetLanguageId} className='text-primary hover:text-primary-hover'>
            {targetLanguageText}
          </label>
          <Select
            id={targetLanguageId}
            items={languageItems}
            value={targetLanguageItem}
            disabled={isTargetDisabled}
            onChange={handleSelectTargetLanguage}
          />
        </li>
      </ul>
    </section>
  )
}
