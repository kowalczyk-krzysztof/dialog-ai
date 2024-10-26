import { useTranslation } from 'react-i18next'

export const LoadingDots = () => {
  const { t } = useTranslation()
  const loadingText = t('loading')

  return (
    <div className='my-2 flex items-center justify-center gap-2'>
      <span className='sr-only'>{loadingText}</span>
      <div className='size-3 animate-bounce rounded-full bg-slate-200 [animation-delay:-0.3s]'></div>
      <div className='size-3 animate-bounce rounded-full bg-slate-200 [animation-delay:-0.15s]'></div>
      <div className='size-3 animate-bounce rounded-full bg-slate-200'></div>
    </div>
  )
}
