import { Event } from '@exteranto/core'

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
