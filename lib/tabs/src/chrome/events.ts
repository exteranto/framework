import { Dispatcher } from '@exteranto/events'
import { Tab } from './Tab'
import { Tabs } from '../safari/Tabs'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  chrome.tabs.onCreated.addListener((tab) => {
    dispatcher.fire('app.tabs.created', new Tab(tab))
  })

  chrome.tabs.onUpdated.addListener((_, __, tab) => {
    dispatcher.fire('app.tabs.updated', new Tab(tab))
  })

  chrome.tabs.onActivated.addListener(({ tabId }) => {
    dispatcher.fire('app.tabs.activated', tabId)
  })

  chrome.tabs.onRemoved.addListener((id) => {
    dispatcher.fire('app.tabs.removed', id)
  })
}
