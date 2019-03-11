import { Event } from '@exteranto/core'
import { StorageType } from './StorageType'

/**
 * Fired upon changing a value in the storage.
 */
export class StorageChangedEvent extends Event {

  /**
   * @param type Whether it was sync or local
   * @param storable What has chagend
   */
  constructor (public type: StorageType, public storable: any) {
    super()
  }

}
