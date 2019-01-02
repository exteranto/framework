import { Dispatcher } from '@exteranto/events'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  browser.runtime.onInstalled.addListener((details) => {
    const event: string = {
      browser_update: 'browserUpdated',
      install: 'installed',
      update: 'updated',
    }[details.reason]

    if (!event) {
      return
    }

    dispatcher.mail(`app.management.runtime.${event}`, details)
  })
}
