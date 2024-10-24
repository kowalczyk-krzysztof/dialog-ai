import Markdown from 'markdown-to-jsx'
import { AIApiType } from '../../../types/types'
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
  const background = getBackground(isUser, isError)

  const handleCopy = () => {
    copyToClipboard(text)
  }

  return (
    <div className={`${background} flex flex-col rounded-lg`}>
      <div className='flex items-center justify-end gap-2 rounded-t-lg border-b border-solid border-slate-200 bg-gray-700 py-1 pr-2 text-sm uppercase text-neutral-900'>
        <p className='rounded bg-slate-200 px-2.5 py-0.5 text-xs font-medium'>{isUser ? 'user' : 'ai'}</p>
        {type && <p className='rounded bg-slate-200 px-2.5 py-0.5 text-xs font-medium'>{type}</p>}
        <button
          onClick={handleCopy}
          className='group inline-flex cursor-pointer justify-center rounded-full p-2 disabled:cursor-not-allowed'
        >
          <Copy className='size-4 fill-blue-600 hover:fill-blue-400 group-disabled:fill-neutral-400' />
        </button>
      </div>
      <div className='p-2'>
        <Markdown options={{ disableParsingRawHTML: true }}>{text}</Markdown>
      </div>
    </div>
  )
}
