import { Event } from '@exteranto/core'

/**
 * This event is fired whenever a cookie is changed in the background script.
 */
export class CookieChangedEvent extends Event {

  /**
   * @param cookie Cookie data object
   */
  constructor (public cookie: any) {
    super()
  }

}
