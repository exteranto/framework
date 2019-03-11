import { Storage } from './Storage'
import { StorageType } from '../StorageType'

export class SyncStorage extends Storage {

  /**
   * The storage type.
   */
  protected type: StorageType = StorageType.SYNC

}
