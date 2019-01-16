import { Event } from '@exteranto/events'

export class StorageChangedEvent extends Event {
  /**
   * @param {string} type
   * @param {any} storable
   */
  constructor (private type: string, private storable: any) {
    super()
  }

  /**
   * Type getter.
   *
   * @return {string}
   */
  public getType () : string {
    return this.type
  }

  /**
   * Storable getter.
   *
   * @return {any}
   */
  public getStorable () : any {
    return this.storable
  }
}

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
