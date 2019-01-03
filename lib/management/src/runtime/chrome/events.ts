import { Dispatcher } from '@exteranto/events'

export const namespace: string = 'app.management.runtime'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  chrome.runtime.onInstalled.addListener((event) => {
    const route: string = {
      chrome_update: 'browserUpdated',
      install: 'installed',
      update: 'updated',
    }[event.reason]

    if (!route) {
      return
    }

    dispatcher.mail(`${namespace}.${route}`, event)
  })

  chrome.webRequest.onBeforeRedirect.addListener((event) => {
    dispatcher.fire(`${namespace}.webRequest.beforeRedirected`, event)
  })

  chrome.webRequest.onCompleted.addListener((event) => {
    dispatcher.fire(`${namespace}.webRequest.completed`, event)
  })
}
