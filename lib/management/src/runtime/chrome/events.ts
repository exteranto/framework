import { Dispatcher } from '@exteranto/events'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  chrome.runtime.onInstalled.addListener((details) => {
    const event = {
      install: 'installed',
      update: 'updated',
      chrome_update: 'browserUpdated'
    }[details.reason]

    if (!event) {
      return
    }

    dispatcher.mail(`app.management.runtime.${event}`, details)
  })
}
