import { Dispatcher } from '@exteranto/events'
import { Tab } from './Tab'

declare var safari: any

const isTab: (target: any) => boolean = (target) => {
  return target.url !== undefined
}

/**
 * Puts ids of all objects in safari (windows and tabs) into one array.
 *
 * @return {number[]}
 */
const getAllIds: () => number[] = () => safari.application.browserWindows
  .reduce((ids, window) => {
    return [...ids, ...window.tabs.map(({ eid }) => eid), window.eid]
  }, [])

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  safari.application.addEventListener('open', ({ target }) => {
    const tabs: number[] = getAllIds()

    const getUniqueId: (id: number) => number = (id) => {
      return tabs.indexOf(id) === -1 ? id : getUniqueId(id + 1)
    }

    // Sets a unique id for a target
    target.eid = getUniqueId(Date.now())
    target.meta = {}

    if (!isTab(target)) {
      return
    }

    dispatcher.fire('app.tabs.created', new Tab(target))

    target.addEventListener('navigate', () => {
      dispatcher.fire('app.tabs.updated', new Tab(target))
    }, true)

    target.addEventListener('close', () => {
      dispatcher.fire('app.tabs.removed', target.eid)
    }, true)

    target.addEventListener('activate', () => {
      dispatcher.fire('app.tabs.activated', target.eid)
    }, true)
  }, true)
}
