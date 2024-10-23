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
    <div className='mt-2 flex w-[420px] items-center rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700'>
      <ScrollArea.Root>
        <ScrollArea.Viewport className='block grow self-start'>
          <textarea
            ref={ref}
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            disabled={disabled}
            className='mx-4 w-[380px] rounded-lg border border-gray-300 bg-slate-400 p-2.5 text-sm text-white focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
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
