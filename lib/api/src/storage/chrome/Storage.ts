import { StorageChangedEvent } from '../events'
import { Storage as AbstractStorage } from '../Storage'
import { StorageKeyNotFoundException } from '@exteranto/exceptions'

export class Storage extends AbstractStorage {

  /**
   * @inheritdoc
   */
  public get (key: any) : Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.storage[this.type].get(key, (val) => {
        const isKeyString: boolean = typeof key === 'string'

        // If a string key doesn't exist in a storage, reject the Promise.
        // Else if a string key exist, resolve with the value.
        // Else resolve with the val object (fallback for an array key).
        isKeyString && val[key] === undefined
          ? reject(new StorageKeyNotFoundException(key))
          : resolve(isKeyString ? val[key] : val)
      })
    })
  }

  /**
   * @inheritdoc
   */
  public set (key: any, value?: any) : Promise<void> {
    return new Promise((resolve) => {
      const storable: any = value ? { [key]: value } : key

      chrome.storage[this.type].set(storable, () => {
        this.dispatcher.fire(new StorageChangedEvent(this.type, storable))

        resolve()
      })
    })
  }

  /**
   * @inheritdoc
   */
  public remove (key: any) : Promise<void> {
    return new Promise(resolve => chrome.storage[this.type].remove(key, resolve))
  }

  /**
   * @inheritdoc
   */
  public clear () : Promise<void> {
    return new Promise(resolve => chrome.storage[this.type].clear(resolve))
  }

  /**
   * @inheritdoc
   */
  public size () : Promise<number> {
    return new Promise((resolve) => {
      chrome.storage[this.type].getBytesInUse(null, resolve)
    })
  }

}
