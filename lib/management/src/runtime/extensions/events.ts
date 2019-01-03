import { Dispatcher } from '@exteranto/events'

export const namespace = 'app.management.runtime'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  browser.runtime.onInstalled.addListener((event) => {
    const route: string = {
      browser_update: 'browserUpdated',
      install: 'installed',
      update: 'updated',
    }[event.reason]

    if (!route) {
      return
    }

    dispatcher.mail(`app.management.runtime.${route}`, event)
  })

  const filter = { urls: ['<all_urls>'] }

  browser.webRequest.onBeforeRedirect.addListener((event) => {
    dispatcher.fire(`${namespace}.webRequest.beforeRedirected`, event)
  }, filter)

  browser.webRequest.onCompleted.addListener((event) => {
    dispatcher.fire(`${namespace}.webRequest.completed`, event)
  }, filter)
}
