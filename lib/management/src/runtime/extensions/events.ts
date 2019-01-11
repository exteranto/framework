import { Dispatcher } from '@exteranto/events'

export const namespace: string = 'app.management.runtime'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  browser.runtime.onInstalled.addListener((event) => {
    const route: string = {
      browser_update: 'browser-updated',
      install: 'installed',
      update: 'updated',
    }[event.reason]

    if (!route) {
      return
    }

    dispatcher.mail(`app.management.runtime.${route}`, event)
  })

  const filter: any = { urls: ['<all_urls>'] }

  browser.webRequest.onBeforeRedirect.addListener((event) => {
    dispatcher.fire(`${namespace}.web-request.before-redirected`, event)
  }, filter)

  browser.webRequest.onCompleted.addListener((event) => {
    dispatcher.fire(`${namespace}.web-request.completed`, event)
  }, filter)
}
