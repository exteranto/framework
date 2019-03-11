import { Storage } from './Storage'
import { StorageType } from '../StorageType'

export class LocalStorage extends Storage {

  /**
   * The storage type.
   */
  protected type: StorageType = StorageType.LOCAL

}
