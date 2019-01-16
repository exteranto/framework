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
      if (typeof key === 'string') {
        const item: any = localStorage.getItem(this.prefix() + key)

        item ? resolve(JSON.parse(item)) : reject()

        return
      }

      // If key is null return all items in the storage.
      if (key === null) {
        return this.all()
      }

      // If key is an array, return key value pairs.
      resolve(key.reduce((carry, id) => {
        const item: any = localStorage.getItem(this.prefix() + id)

        if (item) {
          carry[id] = JSON.parse(item)
        }

        return carry
      }, {}))
    })
  }

  /**
   * Returns all keys in the storage.
   *
   * @override
   * @return {Promise<any>}
   */
  public all () : Promise<any> {
    return new Promise((resolve) => {
      const res: any = {}

      for (let i: number = 0; i < localStorage.length; i++) {
        const id: any = localStorage.key(i)
        const item: any = localStorage.getItem(id)

        // If an item starts with prefix of the module, add it to response.
        if (id.substr(0, this.prefix().length) === this.prefix()) {
          // Get rid of the module prefix in response object.
          res[id.replace(this.prefix(), '')] = JSON.parse(item)
        }
      }

      resolve(res)
    })
  }

  /**
   * Saves a value in the storage.
   *
   * @param {any} key
   * @param {any} value
   * @return {Promise<any>}
   */
  public set (key: any, value?: any) : Promise<any> {
    return new Promise((resolve) => {
      const storable: any = value ? { [key]: value } : key

      for (const property in storable) {
        if (storable.hasOwnProperty(property)) {
          localStorage.setItem(this.prefix() + property, JSON.stringify(storable[property]))
        }
      }

      this.dispatcher.fire(new StorageChangedEvent(this.type, storable))

      resolve()
    })
  }

  /**
   * Removes a value or multiple values from the storage.
   *
   * @param {any} key
   * @return {Promise<void>}
   */
  public remove (key: any) : Promise<void> {
    return new Promise((resolve) => {
      key = typeof key === 'string' ? [key] : key

      key.forEach((id) => {
        localStorage.removeItem(this.prefix() + id)
      })

      resolve()
    })
  }

  /**
   * Clears the whole storage.
   *
   * @return {Promise<void>}
   */
  public clear () : Promise<void> {
    return this.all()
      .then(Object.keys)
      .then(keys => this.remove(keys))
  }

  /**
   * Returns the storage content size in bytes.
   *
   * @return {Promise<number>}
   */
  public size () : Promise<number> {
    return this.all().then(data => JSON.stringify(data).length)
  }

  /**
   * Builds up the safari prefix to distinguish between local and sync storage.
   *
   * @return {string}
   */
  private prefix () : string {
    return '_' + this.type + '_'
  }
}
