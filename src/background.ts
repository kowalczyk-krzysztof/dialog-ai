import { OPEN_DIALOG_ACTION } from '../constants'
;(() => {
  chrome.action.onClicked.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const activeTab = tabs[0]
      if (!activeTab.id || !activeTab.url) return
      chrome.tabs.sendMessage(activeTab.id, { action: OPEN_DIALOG_ACTION }, () => {
        if (chrome.runtime.lastError) {
          // Do nothing
        }
      })
    })
  })
})()
