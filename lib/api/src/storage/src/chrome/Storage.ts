import { StorageChangedEvent } from '../events'
import { Storage as AbstractStorage } from '../Storage'

export class Storage extends AbstractStorage {
  /**
   * Retrieves a value or multiple values from the storage.
   *
   * @param {any} key
   * @return {Promise<any>}
   */
  public get (key: any) : Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.storage[this.type].get(key, (val) => {
        const isKeyString: boolean = typeof key === 'string'

        // If a string key doesn't exist in a storage, reject the Promise.
        // Else if a string key exist, resolve with the value.
        // Else resolve with the val object (fallback for an array key).
        isKeyString && val[key] === undefined
          ? reject()
          : resolve(isKeyString ? val[key] : val)
      })
    })
  }

  /**
   * Saves a value in the storage.
   *
   * @param {any} key
   * @param {any} value
   * @return {Promise<void>}
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
   * Removes a value or multiple values from the storage.
   *
   * @param {any} key
   * @return {Promise<void>}
   */
  public remove (key: any) : Promise<void> {
    return new Promise(resolve => chrome.storage[this.type].remove(key, resolve))
  }

  /**
   * Clears the whole storage.
   *
   * @return {Promise<void>}
   */
  public clear () : Promise<void> {
    return new Promise(resolve => chrome.storage[this.type].clear(resolve))
  }

  /**
   * Returns the storage content size in bytes.
   *
   * @param {any} key
   * @return {Promise<number>}
   */
  public size (key: any = null) : Promise<number> {
    return new Promise((resolve) => {
      chrome.storage[this.type].getBytesInUse(key, resolve)
    })
  }
}
