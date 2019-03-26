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
    const status: 'loading' | 'complete' = info.status as 'loading' | 'complete'

    dispatcher.fire(new TabUpdatedEvent(tab.id, {
      pinned: info.pinned,
      status,
      title: info.title,
      url: info.url,
    }))
  })

  chrome.tabs.onActivated.addListener(({ tabId }) => {
    dispatcher.fire(new TabActivatedEvent(tabId))
  })

  chrome.tabs.onRemoved.addListener((id) => {
    dispatcher.fire(new TabRemovedEvent(id))
  })
}
