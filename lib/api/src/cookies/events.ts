import { Event } from '@exteranto/core'

export class CookieChangedEvent extends Event {
  /**
   * @param {any} cookie
   */
  constructor (private cookie: any) {
    super()
  }

  /**
   * Cookie getter.
   *
   * @return {any}
   */
  public getCookie () : any {
    return this.cookie
  }
}
