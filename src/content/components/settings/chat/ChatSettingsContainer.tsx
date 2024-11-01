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
  const chatSectionTitleText = t('settings.sections.chat')
  const chatTemperatureId = 'chat-temperature'
  const chatTopKId = 'chat-topk'

  useEffect(() => {
    setChatSessionHyperparameters({
      temperature: settings.chatTemperature,
      topK: settings.chatTopK,
    })
  }, [settings, setChatSessionHyperparameters])

  const handleChangeTemperature = (event: ChangeEvent<HTMLInputElement>) => {
    setChatSessionHyperparameters({ ...chatSessionHyperparameters, temperature: Number(event.target.value) })
  }

  const handleChangeTopK = (event: ChangeEvent<HTMLInputElement>) => {
    setChatSessionHyperparameters({ ...chatSessionHyperparameters, topK: Number(event.target.value) })
  }

  return (
    <section className='flex flex-col'>
      <h3 className='select-none text-lg'>{chatSectionTitleText}</h3>
      <ul className='flex flex-col gap-2'>
        <li className='flex items-center gap-2'>
          <label className='text-primary hover:text-primary-hover' htmlFor={chatTemperatureId}>
            {chatTemperatureText}
          </label>
          <input
            id={chatTemperatureId}
            value={chatSessionHyperparameters.temperature}
            className='bg-secondary'
            step='.01'
            type='number'
            min='0'
            max={MAX_CHAT_TEMPERATURE}
            onChange={handleChangeTemperature}
          />
        </li>
        <li className='flex items-center gap-2'>
          <label className='text-primary hover:text-primary-hover' htmlFor={chatTopKId}>
            {chatTopKText}
          </label>
          <input
            id={chatTopKId}
            value={chatSessionHyperparameters.topK}
            className='bg-secondary'
            type='number'
            min='0'
            max={MAX_CHAT_TOPK}
            onChange={handleChangeTopK}
          />
        </li>
      </ul>
    </section>
  )
}
