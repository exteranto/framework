import { Binding, Param, WiredWith } from '@exteranto/ioc'
import { Storage } from '@exteranto/storage'
import { Md5 } from 'md5-typescript'

@Binding
export class Cache {
  /**
   * The cache driver to be used.
   *
   * @var {Storage}
   */
  @WiredWith(['%cache.driver%'])
  private driver: Storage

  /**
   * The cache config.
   *
   * @var {any}
   */
  @Param('cache')
  private config: any

  /**
   * Stores the cacheable object to the specified cache driver.
   *
   * @param {string} key
   * @param {() => any} cacheable
   * @param {number} timeout
   * @return {Promise<any>}
   */
  public store (key: string, cacheable: () => any, timeout?: number) : Promise<any> {
    // Cache can be forfeited on certain enviroments.
    if (this.config.forfeit) {
      return cacheable()
    }

    key = this.createHash(key)

    return this.driver.get(key)
      .then(value => this.isExpired(value) ? Promise.reject(null) : value)
      .catch(() => this.createCache(key, cacheable, timeout))
      .then(({ data }) => data)
  }

  /**
   * Clears the cache.
   *
   * @return {Promise<any>}
   */
  public clear () : Promise<any> {
    return this.driver.all()
      .then(data => Object.keys(data).filter(item => item.match(/^cache__/)))
      .then(filtered => filtered.forEach(key => this.driver.remove(key)))
  }

  /**
   * Checks whether the cached value is expired.
   *
   * @param {any} value
   * @return {boolean}
   */
  private isExpired (value: any) : boolean {
    return value.expiresAt < Date.now()
  }

  /**
   * If the value is not yet stored, it is now physically stored in the cache
   * driver.
   *
   * @param {string} key
   * @param {() => any} cacheable
   * @param {number} timeout
   * @return {Promise<any>}
   */
  private async createCache (key: string, cacheable: () => any, timeout?: number) : Promise<any> {
    return this.driver.set(key, {
      data: await cacheable(),
      expiresAt: this.getExpiration(timeout || this.config.timeout),
    }).then(() => this.driver.get(key))
  }

  /**
   * Calculates the expiration time with a given timeout.
   *
   * @param {number} timeout
   * @return {number}
   */
  private getExpiration (timeout: number) : number {
    return Date.now() + timeout * 1000
  }

  /**
   * Creates a hash from the provided string.
   *
   * @param {string} value
   * @return {string}
   */
  private createHash (value: string) : string {
    return 'cache__' + Md5.init(value)
  }
}
