import { Event } from '@exteranto/core'

export class CookieChangedEvent extends Event {
  /**
   * @param cookie Cookie data object
   */
  constructor (public cookie: any) {
    super()
  }
}
