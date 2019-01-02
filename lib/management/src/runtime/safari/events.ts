import { Dispatcher } from '@exteranto/events'
import { Container } from '@exteranto/ioc'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  const exteranto: any = getExterantoInfo()
  const version: string = Container.resolveParam('app.version')

  if (exteranto.version === version) {
    return
  }

  const event = exteranto.version ? 'installed' : 'updated'

  dispatcher.mail(`app.management.runtime.${event}`, {
    previousVersion: exteranto.version
  })

  localStorage.setItem('@exteranto', JSON.stringify({ ...exteranto, version }))
}

/**
 * Gets exteranto internal info from local storage.
 *
 * @return {any}
 */
const getExterantoInfo: () => any = () : any => {
  try {
    return JSON.parse(localStorage.getItem('@exteranto')) || {}
  } catch (_) {
    localStorage.setItem('@exteranto', '{}')

    return {}
  }
}
