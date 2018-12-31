import { Autowired } from '@exteranto/ioc'
import { Dispatcher, RegistersNativeEvents } from '@exteranto/events'

export abstract class Cookies implements RegistersNativeEvents {

  /**
   * The dispatcher implementation.
   *
   * @var {Dispatcher}
   */
  @Autowired
  protected dispatcher: Dispatcher

  /**
   * Creates a cookies unless it already exists.
   *
   * @param {any} params
   * @return {Promise<void>}
   */
  public async populate (params?: any) : Promise<void> {
    const cookies: any[] = await this.getAll(params)

    return cookies.length === 0 && this.set(params)
  }

  /**
   * Retrives a single cookie.
   *
   * @param {string} key
   * @param {string} value
   * @return {Promise<any>}
   */
  public abstract get (url: string, name: string) : Promise<any>

  /**
   * Filters through all cookies.
   *
   * @param {any} params
   * @return {Promise<any[]>}
   */
  public abstract getAll (params?: any) : Promise<any[]>

  /**
   * Creates or updates a cookie.
   *
   * @param {any} params
   * @return {Promise<void>}
   */
  public abstract set (params?: any) : Promise<void>

  /**
   * @inheritdoc
   */
  public abstract registerEvents(dispatcher: Dispatcher): void
}
