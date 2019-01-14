import { Dispatcher } from '@exteranto/events'

export const namespace: string = 'app.management.runtime'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  chrome.runtime.onInstalled.addListener((event) => {
    const route: string = {
      chrome_update: 'browser-updated',
      install: 'installed',
      update: 'updated',
    }[event.reason]

    if (!route) {
      return
    }

    dispatcher.mail(`${namespace}.${route}`, event)
  })

  const filter: any = { urls: ['<all_urls>'] }

  chrome.webRequest.onBeforeRedirect.addListener((event) => {
    dispatcher.fire(`${namespace}.web-request.before-redirected`, event)
  }, filter)

  chrome.webRequest.onCompleted.addListener((event) => {
    dispatcher.fire(`${namespace}.web-request.completed`, event)
  }, filter)
}
