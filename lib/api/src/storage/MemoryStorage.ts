import { Storage } from './Storage'
import { StorageKey } from './types'
import { StorageType } from './StorageType'
import { StorageChangedEvent } from './events'
import { StorageKeyNotFoundException } from './exceptions'

export class MemoryStorage extends Storage {

  /**
   * The data storage object.
   */
  private data: any = {}

  /**
   * {@inheritdoc}
   */
  public async get<T> (key: StorageKey | null) : Promise<T> {
    if (typeof key === 'string') {
      return this.data[key] === undefined
        ? Promise.reject(new StorageKeyNotFoundException(key))
        : JSON.parse(this.data[key])
    }

    // If key is null return all items in the storage.
    const target: string[] = key === null
      ? Object.keys(this.data)
      : key

    // If key is an array, return key value pairs.
    return target.reduce((carry: any, id: string) => ({ ...carry, [id]: JSON.parse(this.data[id]) }), {})
  }

  /**
   * {@inheritdoc}
   */
  public async set (key: any, value?: any) : Promise<void> {
    const storable: any = value === undefined ? key : { [key]: value }

    Object.keys(storable).forEach((id) => {
      this.data[id] = JSON.stringify(storable[id], this.replacer())
    })

    this.dispatcher.fire(new StorageChangedEvent(StorageType.MEMORY, storable))
  }

  /**
   * {@inheritdoc}
   */
  public async remove (key: StorageKey) : Promise<void> {
    const removable: string[] = [].concat(key)

    removable.forEach(id => delete this.data[id])
  }

  /**
   * {@inheritdoc}
   */
  public async clear () : Promise<void> {
    this.data = {}
  }

  /**
   * {@inheritdoc}
   */
  public async size () : Promise<number> {
    return this.all().then(data => JSON.stringify(data).length)
  }

  /**
   * Circular dependency replacer.
   *
   * @return The replacer callback
   */
  private replacer () : (key: string, value: any) => any {
    const seen: WeakSet<any> = new WeakSet()

    return (_, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return null
        }

        seen.add(value)
      }

      return value
    }
  }
}
