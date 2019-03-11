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
  public async get<T> (key: StorageKey) : Promise<T> {
    if (typeof key === 'string') {
      const item: any = localStorage.getItem(this.prefix() + key)

      return item === undefined
        ? Promise.reject(new StorageKeyNotFoundException(key))
        : JSON.parse(item)
    }

    // If key is null return all items in the storage.
    if (key === null) {
      return this.all()
    }

    // If key is an array, return key value pairs.
    return key.reduce((carry, id) => {
      const item: any = localStorage.getItem(this.prefix() + id)

      if (item) {
        carry[id] = JSON.parse(item)
      }

      return carry
    }, {}) as T
  }

  /**
   * {@inheritdoc}
   */
  public async all () : Promise<any> {
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

    return res
  }

  /**
   * {@inheritdoc}
   */
  public async set (key: any, value?: any) : Promise<void> {
    const storable: any = value === undefined ? key : { [key]: value }

    for (const property in storable) {
      if (storable.hasOwnProperty(property)) {
        localStorage.setItem(this.prefix() + property, JSON.stringify(storable[property]))
      }
    }

    this.dispatcher.fire(new StorageChangedEvent(this.type, storable))
  }

  /**
   * {@inheritdoc}
   */
  public async remove (key: any) : Promise<void> {
    const removable: string[] = [].concat(key)

    removable.forEach(id => localStorage.removeItem(this.prefix() + id))
  }

  /**
   * {@inheritdoc}
   */
  public async clear () : Promise<void> {
    return this.all()
      .then(Object.keys)
      .then(keys => this.remove(keys))
  }

  /**
   * {@inheritdoc}
   */
  public async size () : Promise<number> {
    return this.all().then(data => JSON.stringify(data).length)
  }

  /**
   * Builds up the safari prefix to distinguish between local and sync storage.
   *
   * @return Encoded storage type
   */
  private prefix () : string {
    return '_' + this.type + '_'
  }

}
