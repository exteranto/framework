import { Dispatcher } from '@exteranto/core'
import {
  TabCreatedEvent,
  TabUpdatedEvent,
  TabActivatedEvent,
  TabRemovedEvent,
} from '../events'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  chrome.tabs.onCreated.addListener((tab) => {
    dispatcher.fire(new TabCreatedEvent(tab.id))
  })

  chrome.tabs.onUpdated.addListener((_, info, tab) => {
    dispatcher.fire(new TabUpdatedEvent(tab.id, info))
  })

  chrome.tabs.onActivated.addListener(({ tabId }) => {
    dispatcher.fire(new TabActivatedEvent(tabId))
  })

  chrome.tabs.onRemoved.addListener((id) => {
    dispatcher.fire(new TabRemovedEvent(id))
  })
}
