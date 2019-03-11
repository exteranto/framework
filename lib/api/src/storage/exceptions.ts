import { StorageKey } from './types'
import { Exception } from '@exteranto/core'

export class StorageException extends Exception {
  //
}

export class StorageKeyNotFoundException extends StorageException {

  /**
   * @param key The key that caused the error
   */
  constructor (public key: StorageKey | null) {
    super()
  }

}
