import { Event } from '@exteranto/core'
import { TabInterface } from './TabInterface'

export class TabCreatedEvent extends Event {
  /**
   * @param {TabInterface} tab
   */
  constructor (public tab: TabInterface) {
    super()
  }
}

export class TabUpdatedEvent extends Event {
  /**
   * @param {TabInterface} tab
   */
  constructor (public tab: TabInterface) {
    super()
  }
}

export class TabActivatedEvent extends Event {
  /**
   * @param {number} tabId
   */
  constructor (public tabId: number) {
    super()
  }
}

export class TabRemovedEvent extends Event {
  /**
   * @param {number} tabId
   */
  constructor (public tabId: number) {
    super()
  }
}
