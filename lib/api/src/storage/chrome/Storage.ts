import { StorageKey } from '../types'
import { StorageType } from '../StorageType'
import { StorageChangedEvent } from '../events'
import { Storage as AbstractStorage } from '../Storage'
import { StorageKeyNotFoundException } from '@internal/storage/exceptions'

export abstract class Storage extends AbstractStorage {

  /**
   * The storage type.
   */
  protected abstract type: StorageType

  /**
   * {@inheritdoc}
   */
  public async get<T> (key: StorageKey | null) : Promise<T> {
    return new Promise<T>((resolve, reject) => {
      chrome.storage[this.type].get(key, (val) => {
        const isKeyString: boolean = typeof key === 'string'

        // If a string key doesn't exist in a storage, reject the Promise.
        // Else if a string key exist, resolve with the value.
        // Else resolve with the val object (fallback for an array key).
        isKeyString && val[key as string] === undefined
          ? reject(new StorageKeyNotFoundException(key))
          : resolve(isKeyString ? val[key as string] : val)
      })
    })
  }

  /**
   * {@inheritdoc}
   */
  public async set (key: any, value?: any) : Promise<void> {
    return new Promise<void>((resolve) => {
      const storable: any = value ? { [key]: value } : key

      chrome.storage[this.type].set(storable, () => {
        this.dispatcher.fire(new StorageChangedEvent(this.type, storable))

        resolve()
      })
    })
  }

  /**
   * {@inheritdoc}
   */
  public async remove (key: StorageKey) : Promise<void> {
    return new Promise<void>(resolve => chrome.storage[this.type].remove(key, resolve))
  }

  /**
   * {@inheritdoc}
   */
  public async clear () : Promise<void> {
    return new Promise<void>(resolve => chrome.storage[this.type].clear(resolve))
  }

  /**
   * {@inheritdoc}
   */
  public async size () : Promise<number> {
    return new Promise<number>((resolve) => {
      chrome.storage[this.type].getBytesInUse(null, resolve)
    })
  }

}
