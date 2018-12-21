import { Dispatcher } from '@exteranto/events'
import { Tab } from './Tab'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  browser.tabs.onCreated.addListener((tab) => {
    dispatcher.fire('app.tabs.created', new Tab(tab))
  })

  browser.tabs.onUpdated.addListener((_, __, tab) => {
    dispatcher.fire('app.tabs.updated', new Tab(tab))
  })

  browser.tabs.onActivated.addListener(({ tabId }) => {
    dispatcher.fire('app.tabs.activated', tabId)
  })

  browser.tabs.onRemoved.addListener((id) => {
    dispatcher.fire('app.tabs.removed', id)
  })
}
