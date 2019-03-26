import { Event } from '@exteranto/core'

export interface ChangeInfo {

  /**
   * The loading status of the tab.
   */
  status?: 'loading' | 'complete'

  /**
   * The tab's new URL if it has changed.
   */
  url?: string

  /**
   * The tab's new title if it has changed.
   */
  title?: string

  /**
   * The tab's new pinned status if it has changed.
   */
  pinned?: boolean

}

/**
 * Parent event for all tab events.
 */
export class TabEvent extends Event {

  /**
   * @param tabId Id of tab that was activated
   */
  constructor (public tabId: number) {
    super()
  }

}

/**
 * Fires every time new tab is created.
 */
export class TabCreatedEvent extends TabEvent {
  //
}

/**
 * Fires every time any parameter of a tab is updated,
 * most common is loading new url.
 */
export class TabUpdatedEvent extends TabEvent {

  /**
   * @param tabId Id of tab that was activated
   */
  constructor (tabId: number, public changeInfo: ChangeInfo) {
    super(tabId)
  }

}

/**
 * Fires when another tab gets focused.
 */
export class TabActivatedEvent extends TabEvent {
  //
}

/**
 * Fires when a tab is closed.
 */
export class TabRemovedEvent extends TabEvent {
  //
}
