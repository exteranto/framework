import { Md5 } from 'md5-typescript'
import { Storage } from '@exteranto/api'
import { Binding, Param, With } from '@exteranto/core'

@Binding
export class Cache {

  /**
   * The cache driver to be used.
   */
  @With<Storage>(['%cache.driver%'])
  private driver: Storage

  /**
   * The hasher instance.
   */
  private hasher: any = Md5

  /**
   * The cache config.
   */
  @Param('cache')
  private config: any

  /**
   * Stores the cacheable object to the specified cache driver.
   *
   * @param key The cache key to be used
   * @param cacheable The callback whose return value is cached
   * @param timeout Optional cache timeout in seconds, falls back to global cache config
   * @return The desired value cached
   */
  public async store (key: string, cacheable: () => any, timeout?: number) : Promise<any> {
    // Cache can be forfeited on certain enviroments.
    if (this.config.forfeit) {
      return cacheable()
    }

    key = this.createHash(key)

    return this.driver.get(key)
      .then(value => this.isExpired(value) ? Promise.reject() : value)
      .catch(() => this.createCache(key, cacheable, timeout))
      .then(({ data }) => data)
  }

  /**
   * Clears all keys stored in the cache.
   */
  public async clear () : Promise<void> {
    return this.driver.all()
      .then(data => Object.keys(data).filter(item => item.match(/^cache__/)))
      .then(filtered => filtered.forEach(key => this.driver.remove(key)))
  }

  /**
   * Checks whether the cached value is expired.
   *
   * @param value The cached object
   * @return Whether the value is expired
   */
  private isExpired (value: any) : boolean {
    return value.expiresAt < Date.now()
  }

  /**
   * If the value is not yet stored, it is now physically stored in the cache
   * driver.
   *
   * @param key The cache key to be used
   * @param cacheable The callback whose return value is cached
   * @param timeout The cache timeout in seconds
   * @return The desired value stored using the storage driver
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
   * @param timeout Cache timeout in seconds
   * @return Unix timestamp of cache expiration
   */
  private getExpiration (timeout: number) : number {
    return Date.now() + timeout * 1000
  }

  /**
   * Creates a hash from the provided string.
   *
   * @param value The value to be hashed
   * @return The resulting hash
   */
  private createHash (value: string) : string {
    return 'cache__' + this.hasher.init(value)
  }

}
