import { Autowired, Dispatcher } from '@exteranto/core'

export abstract class Storage {
  /**
   * The dispatcher implementation.
   */
  @Autowired
  protected dispatcher: Dispatcher

  /**
   * @param type Storage can be either local or sync
   */
  constructor (protected type: string) {
    //
  }

  /**
   * If and only if the key is not set, it is populated.
   *
   * @param key Storage key to retrieve
   * @param value Value to set the key to
   */
  public populate (key: string, value: any) : Promise<void> {
    return this.get(key).catch(() => this.set(key, value))
  }

  /**
   * Returns all keys in the storage.
   *
   * @return Key value storage object
   */
  public all () : Promise<any> {
    return this.get(null)
  }

  /**
   * Retrieves a value or multiple values from the storage.
   *
   * @param key Storage key to retrieve
   * @return Associated value in storage
   */
  public abstract get (key: string|string[]) : Promise<any>

  /**
   * Saves a value in the storage.
   *
   * @param key Storage key to set or key value object to store
   * @param value Value to set the key to
   */
  public abstract set (key: any, value?: any) : Promise<void>

  /**
   * Removes a value or multiple values from the storage.
   *
   * @param key Storage key to remove
   */
  public abstract remove (key: string|string[]) : Promise<void>

  /**
   * Clears the whole storage.
   */
  public abstract clear () : Promise<void>

  /**
   * Returns the storage content size in bytes.
   *
   * @return Number of bytes used by the storage
   */
  public abstract size () : Promise<number>
}
