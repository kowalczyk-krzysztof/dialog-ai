import { forwardRef, Ref, type Dispatch, type SetStateAction } from 'react'
import type { Conversation } from '../../../types/types'
import { SendPromptButton } from './SendPromptButton'
import * as ScrollArea from '@radix-ui/react-scroll-area'

interface Props {
  userInput: string
  disabled: boolean
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
}

export const UserInputContainer = forwardRef<HTMLTextAreaElement, Props>(
  ({ userInput, disabled, setUserInput, setConversation }, ref: Ref<HTMLTextAreaElement>) => (
    <div className='flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 w-[420px] mt-2'>
      <ScrollArea.Root>
        <ScrollArea.Viewport className='self-start flex-grow block'>
          <textarea
            ref={ref}
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            disabled={disabled}
            className='w-[380px] mx-4 p-2.5 text-sm text-white bg-slate-400 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          />
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation='vertical'>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>

      <SendPromptButton
        userInput={userInput}
        setUserInput={setUserInput}
        disabled={disabled}
        setConversation={setConversation}
      />
    </div>
  )
)
