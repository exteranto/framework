import { Dispatcher } from '@exteranto/events'
import { Tab } from './Tab'
import {
  TabCreatedEvent,
  TabUpdatedEvent,
  TabActivatedEvent,
  TabRemovedEvent,
} from '../events'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  browser.tabs.onCreated.addListener((tab) => {
    dispatcher.fire(new TabCreatedEvent(new Tab(tab)))
  })

  browser.tabs.onUpdated.addListener((_, __, tab) => {
    dispatcher.fire(new TabUpdatedEvent(new Tab(tab)))
  })

  browser.tabs.onActivated.addListener(({ tabId }) => {
    dispatcher.fire(new TabActivatedEvent(tabId))
  })

  browser.tabs.onRemoved.addListener((id) => {
    dispatcher.fire(new TabRemovedEvent(id))
  })
}
