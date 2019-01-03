import { Container } from '@exteranto/ioc'
import { Dispatcher } from '@exteranto/events'

declare var safari: any

export const namespace = 'app.management.runtime'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  safari.application.addEventListener('beforeNavigate', (event) => {
    dispatcher.fire(`${namespace}.webRequest.beforeRedirected`, {
      url: event.target.url,
      tabId: event.target.eid,
      timeStamp: event.timeStamp,
      redirectUrl: event.url,
    })
  })

  safari.application.addEventListener('navigate', (event) => {
    dispatcher.fire(`${namespace}.webRequest.completed`, {
      url: event.target.url,
      tabId: event.target.eid,
      timeStamp: event.timeStamp,
    })
  })

  registerInstallAndUpdateEvents(dispatcher)
}

const registerInstallAndUpdateEvents: (dispatcher: Dispatcher) => void = (dispatcher) => {
  const exteranto: any = getExterantoInfo()
  const version: string = Container.resolveParam('app.version')

  if (exteranto.version === version) {
    return
  }

  const event: string = exteranto.version ? 'updated' : 'installed'

  dispatcher.mail(`${namespace}.${event}`, {
    previousVersion: exteranto.version,
  })

  localStorage.setItem('@exteranto', JSON.stringify({ ...exteranto, version }))
}

/**
 * Gets exteranto internal info from local storage.
 *
 * @return {any}
 */
const getExterantoInfo: () => any = () => {
  try {
    return JSON.parse(localStorage.getItem('@exteranto')) || {}
  } catch (_) {
    localStorage.setItem('@exteranto', '{}')

    return {}
  }
}
