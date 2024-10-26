import Markdown from 'markdown-to-jsx'
import { useTranslation } from 'react-i18next'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import type { AIApiType } from '../../../types/types'
import { Badge } from '../../shared/Badge'
import Copy from '../../icons/copy.svg?react'

interface Props {
  text: string
  isUser: boolean
  isError?: boolean
  type?: AIApiType
}

const getBackground = (isUser: boolean, isError?: boolean) => {
  if (isError) {
    return 'bg-red-600'
  }
  return isUser ? 'bg-neutral-600' : 'bg-neutral-700'
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

export const MessageContainer = ({ text, isUser, isError, type }: Props) => {
  const { t } = useTranslation()
  const background = getBackground(isUser, isError)

  const handleCopy = () => {
    copyToClipboard(text)
  }

  return (
    <div className={`${background} flex flex-col rounded-lg`}>
      <div className='flex items-center justify-end gap-2 bg-gray-700 py-0.5 pr-2 border border-solid border-slate-200 border-b-0'>
        {type ? <Badge>{type}</Badge> : null}
        <Badge>{isUser ? 'user' : 'ai'}</Badge>
        <button
          onClick={handleCopy}
          className='group flex cursor-pointer justify-center p-2 hover:bg-gray-500 disabled:cursor-not-allowed'
        >
          <AccessibleIcon label={t('buttons.copy')}>
            <Copy className='size-4 fill-blue-600 group-disabled:fill-neutral-400' />
          </AccessibleIcon>
        </button>
      </div>
      <div className='p-2 border border-solid border-slate-200 border-t-0 rounded-b-md break-words'>
        <Markdown options={{ disableParsingRawHTML: true }}>{text}</Markdown>
      </div>
    </div>
  )
}
