import { Event } from '@exteranto/events'
import { TabInterface } from './TabInterface'

export class TabCreatedEvent extends Event {
  /**
   * @param {TabInterface} tab
   */
  constructor (private tab: TabInterface) {
    super()
  }

 /**
  * Tab getter.
  *
  * @return {TabInterface}
  */
  public getTab () : TabInterface {
    return this.tab
  }
}

export class TabUpdatedEvent extends Event {
  /**
   * @param {TabInterface} tab
   */
  constructor (private tab: TabInterface) {
    super()
  }

 /**
  * Tab getter.
  *
  * @return {TabInterface}
  */
  public getTab () : TabInterface {
    return this.tab
  }
}

export class TabActivatedEvent extends Event {
  /**
   * @param {number} tabId
   */
  constructor (private tabId: number) {
    super()
  }

 /**
  * Tab id getter.
  *
  * @return {number}
  */
  public getTabId () : number {
    return this.tabId
  }
}

export class TabRemovedEvent extends Event {
  /**
   * @param {number} tabId
   */
  constructor (private tabId: number) {
    super()
  }

 /**
  * Tab id getter.
  *
  * @return {number}
  */
  public getTabId () : number {
    return this.tabId
  }
}
