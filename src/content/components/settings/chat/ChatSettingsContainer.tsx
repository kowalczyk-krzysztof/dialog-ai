import { Dispatch, SetStateAction, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { MAX_CHAT_TEMPERATURE, MAX_CHAT_TOPK } from '../../../../../constants'
import { ChatSessionHyperParameters, ExtensionSettings } from '../../../types'

interface Props {
  settings: ExtensionSettings
  setChatSessionHyperparameters: Dispatch<SetStateAction<ChatSessionHyperParameters>>
}

const schema = z.object({
  temperature: z.number().min(0).max(MAX_CHAT_TEMPERATURE).multipleOf(0.01),
  topK: z.number().min(1).max(MAX_CHAT_TOPK),
})

type FormValues = z.infer<typeof schema>

export const ChatSettingsContainer = ({ settings, setChatSessionHyperparameters }: Props) => {
  const { t } = useTranslation()

  const { control, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      temperature: settings.chatTemperature,
      topK: settings.chatTopK,
    },
  })

  const watchedTemperature = watch('temperature')
  const watchedTopK = watch('topK')

  useEffect(() => {
    setValue('temperature', settings.chatTemperature)
    setValue('topK', settings.chatTopK)
    setChatSessionHyperparameters({
      temperature: settings.chatTemperature,
      topK: settings.chatTopK,
    })
  }, [settings, setValue, setChatSessionHyperparameters])

  useEffect(() => {
    setChatSessionHyperparameters({ temperature: watchedTemperature, topK: watchedTopK })
  }, [watchedTemperature, watchedTopK, setChatSessionHyperparameters])

  const chatTemperatureText = t('settings.chatTemperature')
  const chatTopKText = t('settings.chatTopK')
  const chatSectionTitleText = t('settings.sections.chat')
  const chatTemperatureId = 'chat-temperature'
  const chatTopKId = 'chat-topk'

  return (
    <section className='flex w-full flex-col rounded-lg border border-border bg-tertiary p-2'>
      <h3 className='mb-4 select-none self-center text-lg'>{chatSectionTitleText}</h3>
      <ul className='flex flex-col gap-2'>
        <li className='flex items-center gap-2'>
          <label className='text-primary hover:text-primary-hover' htmlFor={chatTemperatureId}>
            {chatTemperatureText}
          </label>
          <Controller
            name='temperature'
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id={chatTemperatureId}
                type='number'
                inputMode='decimal'
                step='.01'
                min='0'
                max={MAX_CHAT_TEMPERATURE}
                className='w-14 border border-border bg-secondary'
              />
            )}
          />
        </li>
        <li className='flex items-center gap-2'>
          <label className='text-primary hover:text-primary-hover' htmlFor={chatTopKId}>
            {chatTopKText}
          </label>
          <Controller
            name='topK'
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id={chatTopKId}
                type='number'
                inputMode='numeric'
                min='1'
                max={MAX_CHAT_TOPK}
                className='w-14 border border-border bg-secondary'
              />
            )}
          />
        </li>
      </ul>
    </section>
  )
}
