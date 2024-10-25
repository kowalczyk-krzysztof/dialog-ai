import Markdown from 'markdown-to-jsx'
import * as AccessibleIcon from '@radix-ui/react-accessible-icon'
import { AIApiType } from '../../../types/types'
import Copy from '../../icons/copy.svg?react'
import { Badge } from '../../shared/Badge'

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
  const background = getBackground(isUser, isError)

  const handleCopy = () => {
    copyToClipboard(text)
  }

  return (
    <div className={`${background} flex flex-col rounded-lg`}>
      <div className='flex items-center justify-end gap-2 rounded-t-lg border-b border-solid border-slate-200 bg-gray-700 py-1 pr-2'>
        <Badge>{isUser ? 'user' : 'ai'}</Badge>
        {type && <Badge>{type}</Badge>}
        <button
          onClick={handleCopy}
          className='group flex cursor-pointer justify-center p-2 hover:bg-gray-500 disabled:cursor-not-allowed'
        >
          <AccessibleIcon.Root label='copy content'>
            <Copy className='size-4 fill-blue-600 group-disabled:fill-neutral-400' />
          </AccessibleIcon.Root>
        </button>
      </div>
      <div className='p-2'>
        <Markdown options={{ disableParsingRawHTML: true }}>{text}</Markdown>
      </div>
    </div>
  )
}
