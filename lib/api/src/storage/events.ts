import { Event } from '@exteranto/core'

export class StorageChangedEvent extends Event {
  /**
   * @param {string} type
   * @param {any} storable
   */
  constructor (public type: string, public storable: any) {
    super()
  }
}
