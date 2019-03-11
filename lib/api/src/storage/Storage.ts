import { Autowired, Dispatcher } from '@exteranto/core'

export abstract class Storage {

  /**
   * The dispatcher implementation.
   */
  @Autowired
  protected dispatcher: Dispatcher

  /**
   * If and only if the key is not set, it is populated.
   *
   * @param key Storage key to retrieve
   * @param value Value to set the key to
   */
  public async populate (key: string, value: any) : Promise<void> {
    return this.get(key).catch(() => this.set(key, value))
  }

  /**
   * Returns all keys in the storage.
   *
   * @return Key value storage object
   */
  public async all () : Promise<any> {
    return this.get(null)
  }

  /**
   * Retrieves a value or multiple values from the storage.
   *
   * @param key Storage key to retrieve
   * @return Associated value in storage
   */
  public abstract async get (key: string|string[]) : Promise<any>

  /**
   * Saves a value in the storage.
   *
   * @param key Storage key to set or key value object to store
   * @param value Value to set the key to
   */
  public abstract async set (key: any, value?: any) : Promise<void>

  /**
   * Removes a value or multiple values from the storage.
   *
   * @param key Storage key to remove
   */
  public abstract async remove (key: string|string[]) : Promise<void>

  /**
   * Clears the whole storage.
   */
  public abstract async clear () : Promise<void>

  /**
   * Returns the storage content size in bytes.
   *
   * @return Number of bytes used by the storage
   */
  public abstract async size () : Promise<number>

}
