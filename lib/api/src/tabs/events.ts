import { Event } from '@exteranto/core'
import { TabInterface } from './TabInterface'

/**
 * Fires everytime new tab is created.
 */
export class TabCreatedEvent extends Event {
  /**
   * @param tab Tab instace that was created
   */
  constructor (public tab: TabInterface) {
    super()
  }
}

/**
 * Fires everytime any parameter of a tab is updated,
 * most common is loading new url.
 */
export class TabUpdatedEvent extends Event {
  /**
   * @param tab Tab instace that was updated
   */
  constructor (public tab: TabInterface) {
    super()
  }
}

/**
 * Fires when another tab gets focused.
 */
export class TabActivatedEvent extends Event {
  /**
   * @param tabId Id of tab that was activated
   */
  constructor (public tabId: number) {
    super()
  }
}

/**
 * Fires when a tab is closed.
 */
export class TabRemovedEvent extends Event {
  /**
   * @param tabId Id of tab that was removed
   */
  constructor (public tabId: number) {
    super()
  }
}
