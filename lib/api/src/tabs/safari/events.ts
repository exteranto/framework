import { Tab } from './Tab'
import { ResponseHub } from './ResponseHub'
import { Dispatcher } from '@exteranto/core'
import {
  TabCreatedEvent,
  TabUpdatedEvent,
  TabActivatedEvent,
  TabRemovedEvent,
} from '../events'

declare var safari: any

/**
 * Checks whether target is a tab or window.
 *
 * @param {any} target
 * @return {boolean}
 */
const isTab: (target: any) => boolean = (target) => {
  return target.url !== undefined
}

/**
 * Gets all opened tabs.
 *
 * @return {any[]}
 */
const getAllTabs: () => any[] = () => safari.application
  .browserWindows
  .reduce((tabs, window) => {
    return [...tabs, ...window.tabs]
  }, [])

/**
 * Puts ids of all objects in safari (windows and tabs) into one array.
 *
 * @return {number[]}
 */
const getAllIds: () => number[] = () => getAllTabs().map(({ eid }) => eid)

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  nativeTabListeners(dispatcher)

  safari.application.addEventListener('message', (response) => {
    // If the message is a response and the event name matches, resolve the promise.
    if (response.name === '_response_' && response.message.id) {
      ResponseHub.resolve(response.message.id, response.message.payload)
    }
  })

  // Registers currently opened tabs.
  getAllTabs().forEach(tab => introduceToEcosystem(tab, dispatcher))
}

/**
 * Registers native tab events.
 *
 * @param {Dispatcher} dispatcher
 */
const nativeTabListeners: (dispatcher: Dispatcher) => void = (dispatcher) => {
  safari.application.addEventListener('open', ({ target }) => {
    introduceToEcosystem(target, dispatcher)
  }, true)
}

/**
 * Does all necessary preprocesses for tab/window so that
 * it can be used by the framework.
 *
 * @param {any} target
 * @param {Dispatcher} dispatcher
 * @return {void}
 */
const introduceToEcosystem: (target: any, dispatcher: Dispatcher) => void = (target, dispatcher) => {
  if (target.eid) {
    return
  }

  const ids: number[] = getAllIds()

  const getUniqueId: (id: number) => number = (id) => {
    return ids.indexOf(id) === -1 ? id : getUniqueId(id + 1)
  }

  // Sets a unique id for a target
  target.eid = getUniqueId(Date.now())
  target.meta = {}

  if (!isTab(target)) {
    return
  }

  dispatcher.fire(new TabCreatedEvent(new Tab(target)))

  target.addEventListener('navigate', () => {
    dispatcher.fire(new TabUpdatedEvent(new Tab(target)))
  }, true)

  target.addEventListener('close', () => {
    dispatcher.fire(new TabRemovedEvent(target.eid))
  }, true)

  target.addEventListener('activate', () => {
    dispatcher.fire(new TabActivatedEvent(target.eid))
  }, true)
}
