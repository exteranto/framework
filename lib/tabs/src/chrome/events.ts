import { Dispatcher } from '@exteranto/events'
import { Tab } from './Tab'
import {
  TabCreatedEvent,
  TabUpdatedEvent,
  TabActivatedEvent,
  TabRemovedEvent,
} from '../events'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  chrome.tabs.onCreated.addListener((tab) => {
    dispatcher.fire(new TabCreatedEvent(new Tab(tab)))
  })

  chrome.tabs.onUpdated.addListener((_, __, tab) => {
    dispatcher.fire(new TabUpdatedEvent(new Tab(tab)))
  })

  chrome.tabs.onActivated.addListener(({ tabId }) => {
    dispatcher.fire(new TabActivatedEvent(tabId))
  })

  chrome.tabs.onRemoved.addListener((id) => {
    dispatcher.fire(new TabRemovedEvent(id))
  })
}
