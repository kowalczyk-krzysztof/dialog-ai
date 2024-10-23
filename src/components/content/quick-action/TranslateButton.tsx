import { ChangeEvent, type Dispatch, type SetStateAction, useState } from 'react'
import { QuickActionButton } from './QuickActionButton'
import { getTranslation } from '../../../utils/ai'
import { SupportedLanguages, type Conversation } from '../../../types/types'
import { useTranslation } from 'react-i18next'

interface Props {
  userInput: string
  disabled: boolean
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
}

export const TranslateButton = ({ userInput, disabled, setUserInput, setConversation }: Props) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [sourceLanguage, setSourceLanguage] = useState(SupportedLanguages.ENGLISH)
  const [targetLanguage, setTargetLanguage] = useState(SupportedLanguages.SPANISH)

  const handleGetResponse = async () => {
    setUserInput('')
    setIsLoading(true)
    await getTranslation(userInput, { sourceLanguage, targetLanguage }, setConversation)
    setIsLoading(false)
  }

  const handleSelectSourceLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    setSourceLanguage(event.target.value as SupportedLanguages)
  }

  const handleSelectTargetLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    setTargetLanguage(event.target.value as SupportedLanguages)
  }

  const isDisabled = !userInput || isLoading || disabled

  // TODO: Figure out UX for selecting language pair
  return (
    <div>
      <QuickActionButton disabled={isDisabled} onClick={handleGetResponse}>
        {t('buttons.translate')}
      </QuickActionButton>
      <label htmlFor='source' className='hidden'>
        Source:
      </label>
      <select name='source' id='source' onChange={handleSelectSourceLanguage} className='hidden w-6'>
        {Object.values(SupportedLanguages).map(language => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>
      <label htmlFor='target' className='hidden'>
        Target:
      </label>
      <select name='target' id='target' onChange={handleSelectTargetLanguage} className='hidden w-6'>
        {Object.values(SupportedLanguages).map(language => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>
    </div>
  )
}
