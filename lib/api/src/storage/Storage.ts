import { Autowired, Dispatcher } from '@exteranto/core'

export abstract class Storage {
  /**
   * The dispatcher implementation.
   *
   * @var {Dispatcher}
   */
  @Autowired
  protected dispatcher: Dispatcher

  /**
   * Class constructor.
   *
   * @param {string} type
   */
  constructor (protected type: string) {
    //
  }

  /**
   * Alias for storage set method.
   *
   * @param {string} key
   * @param {any} value
   * @return {Promise<void>}
   */
  public put (key: string, value?: any) : Promise<void> {
    return this.set(key, value)
  }

  /**
   * If and only if the key is not set, it is populated.
   *
   * @param {string} key
   * @param {any} value
   * @return {Promise<void>}
   */
  public populate (key: string, value: any) : Promise<void> {
    return this.get(key).catch(() => this.set(key, value))
  }

  /**
   * Alias for storage get method.
   *
   * @param {any} key
   * @return {Promise<any>}
   */
  public collect (key: any = null) : Promise<any> {
    return this.get(key)
  }

  /**
   * Returns all keys in the storage.
   *
   * @return {Promise<any>}
   */
  public all () : Promise<any> {
    return this.get(null)
  }

  /**
   * Retrieves a value or multiple values from the storage.
   *
   * @param {any} key
   * @return {Promise<any>}
   */
  public abstract get (key: any) : Promise<any>

  /**
   * Saves a value in the storage.
   *
   * @param {string} key
   * @param {any} value
   * @return {Promise<any>}
   */
  public abstract set (key: string, value?: any) : Promise<any>

  /**
   * Removes a value or multiple values from the storage.
   *
   * @param {any} key
   * @return {Promise<void>}
   */
  public abstract remove (key: any) : Promise<void>

  /**
   * Clears the whole storage.
   *
   * @return {Promise<void>}
   */
  public abstract clear () : Promise<void>

  /**
   * Returns the storage content size in bytes.
   *
   * @return {Promise<number>}
   */
  public abstract size () : Promise<number>
}
