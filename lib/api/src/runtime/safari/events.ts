import { Container } from '@exteranto/core'
import { Dispatcher, Event } from '@exteranto/core'
import {
  ExtensionUpdatedEvent,
  ExtensionInstalledEvent,
} from '../events'

/**
 * Registers safari mocks of install and update events.
 *
 * @param dispatcher The dispatched implementation
 */
export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  const exteranto: any = getExterantoInfo()
  const previousVersion: string = exteranto.version
  const version: string = Container.getInstance().resolveParam<string>('app.version')

  if (previousVersion === version) {
    return
  }

  const event: Event = previousVersion
    ? new ExtensionUpdatedEvent(previousVersion)
    : new ExtensionInstalledEvent()

  dispatcher.mail(event)

  localStorage.setItem('@exteranto', JSON.stringify({ ...exteranto, version }))
}

/**
 * Gets exteranto internal info from local storage.
 *
 * @return Exteranto info from local storage
 */
const getExterantoInfo: () => any = () => {
  try {
    return JSON.parse(localStorage.getItem('@exteranto')) || {}
  } catch (_) {
    localStorage.setItem('@exteranto', '{}')

    return {}
  }

}
