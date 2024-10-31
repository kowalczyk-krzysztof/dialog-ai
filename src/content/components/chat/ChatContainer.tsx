import { ConversationContainer } from './conversation/ConversationContainer'
import { QuickActionContainer } from './quick-action/QuickActionContainer'
import { UserInputContainer } from './user-input/UserInputContainer'

interface Props {
  isSettingsViewOpen: boolean
}

export const ChatContainer = ({ isSettingsViewOpen }: Props) => (
  <div className={`${isSettingsViewOpen ? 'hidden' : 'flex flex-col'} px-4 gap-2 items-center `}>
    <ConversationContainer />
    <QuickActionContainer />
    <UserInputContainer />
  </div>
)
