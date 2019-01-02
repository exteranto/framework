import { Dispatcher } from '@exteranto/events'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  const event = 'installed'
  dispatcher.fire(`app.management.runtime.${event}`, {})
}
