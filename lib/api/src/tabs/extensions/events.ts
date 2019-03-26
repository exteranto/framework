import { Dispatcher } from '@exteranto/core'
import {
  TabCreatedEvent,
  TabUpdatedEvent,
  TabActivatedEvent,
  TabRemovedEvent,
} from '../events'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  browser.tabs.onCreated.addListener((tab) => {
    dispatcher.fire(new TabCreatedEvent(tab.id))
  })

  browser.tabs.onUpdated.addListener((_, info, tab) => {
    const status: 'loading' | 'complete' = info.status as 'loading' | 'complete'

    dispatcher.fire(new TabUpdatedEvent(tab.id, {
      pinned: info.pinned,
      status,
      title: info.title,
      url: info.url,
    }))
  })

  browser.tabs.onActivated.addListener(({ tabId }) => {
    dispatcher.fire(new TabActivatedEvent(tabId))
  })

  browser.tabs.onRemoved.addListener((id) => {
    dispatcher.fire(new TabRemovedEvent(id))
  })
}
