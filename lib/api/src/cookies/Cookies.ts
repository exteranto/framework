import { Dispatcher, RegistersNativeEvents } from '@exteranto/core'

export abstract class Cookies implements RegistersNativeEvents {

  /**
   * Creates a cookies unless it already exists.
   *
   * @safari Cookies API doesn't exist and will throw exception. Always check for compatibility.
   *
   * @param params Cookie object to be created if it doesn't exist yet
   * @throws {InvalidCookieRequestException}
   * @throws {NotImplementedException}
   */
  public async populate (params: any) : Promise<void> {
    const cookies: any[] = await this.getAll(params)

    return void (cookies.length === 0 && this.set(params))
  }

  /**
   * Retrives a single cookie.
   *
   * @safari Cookies API doesn't exist and will throw exception. Always check for compatibility.
   *
   * @param url Website url to set the cookie on
   * @param name Name of the cookie
   * @return Cookie data object
   * @throws {InvalidCookieRequestException}
   * @throws {EmptyResponseException}
   * @throws {NotImplementedException}
   */
  public abstract async get (url: string, name: string) : Promise<any>

  /**
   * Filters through all cookies.
   *
   * @safari Cookies API doesn't exist and will throw exception. Always check for compatibility.
   *
   * @param params Criteria for cookie objects
   * @return Array of cookie data objects
   * @throws {InvalidCookieRequestException}
   * @throws {NotImplementedException}
   */
  public abstract async getAll (params?: any) : Promise<any[]>

  /**
   * Creates or updates a cookie.
   *
   * @safari Cookies API doesn't exist and will throw exception. Always check for compatibility.
   *
   * @param params Cookie object to be set
   * @throws {InvalidCookieRequestException}
   * @throws {NotImplementedException}
   */
  public abstract async set (params?: any) : Promise<void>

  /**
   * Register all native events on the given module.
   *
   * @param dispatcher Dispatcher resolved from container
   */
  public abstract registerEvents (dispatcher: Dispatcher) : void

}
