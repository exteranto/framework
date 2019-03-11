import { Storage } from './Storage'
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
  public async get (key: any) : Promise<any> {
    if (typeof key === 'string') {
      return this.data[key] === undefined
        ? Promise.reject(new StorageKeyNotFoundException(key))
        : this.data[key]
    }

    // If key is null return all items in the storage.
    if (key === null) {
      return this.data
    }

    // If key is an array, return key value pairs.
    return key.reduce((carry: any, id: string) => ({ ...carry, [id]: this.data[id] }), {})
  }

  /**
   * {@inheritdoc}
   */
  public async set (key: any, value?: any) : Promise<void> {
    const storable: any = value === undefined ? key : { [key]: value }

    // Spread the current data and the desired storable on top.
    this.data = { ...this.data, ...storable }

    this.dispatcher.fire(new StorageChangedEvent(StorageType.MEMORY, storable))
  }

  /**
   * {@inheritdoc}
   */
  public async remove (key: any) : Promise<void> {
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
    return JSON.stringify(this.data).length
  }

}
