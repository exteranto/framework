import { Container } from '@exteranto/core'
import { Dispatcher, Event } from '@exteranto/core'
import {
  WebRequestBeforeRedirectedEvent,
  WebRequestCompletedEvent,
  ExtensionUpdatedEvent,
  ExtensionInstalledEvent,
} from '../events'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  safari.application.addEventListener('beforeNavigate', (event) => {
    dispatcher.fire(new WebRequestBeforeRedirectedEvent({
      redirectUrl: event.url,
      tabId: event.target.eid,
      timeStamp: event.timeStamp,
      url: event.target.url,
    }))
  })

  safari.application.addEventListener('navigate', (event) => {
    dispatcher.fire(new WebRequestCompletedEvent({
      tabId: event.target.eid,
      timeStamp: event.timeStamp,
      url: event.target.url,
    }))
  })

  registerInstallAndUpdateEvents(dispatcher)
}

/**
 * Registers safari mocks of install and update events.
 *
 * @param {Dispatcher} dispatcher
 */
const registerInstallAndUpdateEvents: (dispatcher: Dispatcher) => void = (dispatcher) => {
  const exteranto: any = getExterantoInfo()
  const previousVersion: string = exteranto.version
  const version: string = Container.resolveParam('app.version')

  if (previousVersion === version) {
    return
  }

  const event: Event = previousVersion
    ? new ExtensionUpdatedEvent({ previousVersion })
    : new ExtensionInstalledEvent()

  dispatcher.mail(event)

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
