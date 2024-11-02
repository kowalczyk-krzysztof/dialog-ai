import { SelectItem } from '../../shared/components/Select'
import { SupportedLanguages } from '../types'

export const isEnglish = (value: string) => value === SupportedLanguages.ENGLISH

export const languageTagToHumanReadable = (
  languageTag: SupportedLanguages,
  targetLanguage: SupportedLanguages = SupportedLanguages.ENGLISH
) => {
  const displayNames = new Intl.DisplayNames([targetLanguage], {
    type: 'language',
  })
  return displayNames.of(languageTag) ?? languageTag
}

export const mapLanguageToSelectOption = (language: SupportedLanguages): SelectItem => ({
  key: language,
  value: language,
  label: languageTagToHumanReadable(language),
})

export const getLanguageItems = () => Object.values(SupportedLanguages).map(mapLanguageToSelectOption)
