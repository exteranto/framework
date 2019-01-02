import { Dispatcher } from '@exteranto/events'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  chrome.runtime.onInstalled.addListener((details) => {
    const event: string = {
      chrome_update: 'browserUpdated',
      install: 'installed',
      update: 'updated',
    }[details.reason]

    if (!event) {
      return
    }

    dispatcher.mail(`app.management.runtime.${event}`, details)
  })
}
