import { ChangeEvent, useEffect, type Dispatch, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { MAX_CHAT_TEMPERATURE, MAX_CHAT_TOPK } from '../../../../../constants'
import { ChatSessionHyperParameters, ExtensionSettings } from '../../../types'

interface Props {
  settings: ExtensionSettings
  chatSessionHyperparameters: ChatSessionHyperParameters
  setChatSessionHyperparameters: Dispatch<SetStateAction<ChatSessionHyperParameters>>
}

export const ChatSettingsContainer = ({
  settings,
  chatSessionHyperparameters,
  setChatSessionHyperparameters,
}: Props) => {
  const { t } = useTranslation()

  const chatTemperatureText = t('settings.chatTemperature')
  const chatTopKText = t('settings.chatTopK')

  useEffect(() => {
    setChatSessionHyperparameters({
      temperature: settings.chatTemperature,
      topK: settings.chatTopK,
    })
  }, [settings])

  const handleChangeTemperature = (event: ChangeEvent<HTMLInputElement>) => {
    setChatSessionHyperparameters({ ...chatSessionHyperparameters, temperature: Number(event.target.value) })
  }

  const handleChangeTopK = (event: ChangeEvent<HTMLInputElement>) => {
    setChatSessionHyperparameters({ ...chatSessionHyperparameters, topK: Number(event.target.value) })
  }

  return (
    <li>
      <ul>
        {chatTemperatureText}
        <input
          value={chatSessionHyperparameters.temperature}
          className='bg-secondary'
          step='.01'
          type='number'
          min='0'
          max={MAX_CHAT_TEMPERATURE}
          onChange={handleChangeTemperature}
        />
      </ul>
      <ul>
        {chatTopKText}
        <input
          value={chatSessionHyperparameters.topK}
          className='bg-secondary'
          type='number'
          min='0'
          max={MAX_CHAT_TOPK}
          onChange={handleChangeTopK}
        />
      </ul>
    </li>
  )
}
