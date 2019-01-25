import { Event } from '@exteranto/core'

export class CookieChangedEvent extends Event {
  /**
   * @param {any} cookie
   */
  constructor (public cookie: any) {
    super()
  }
}
