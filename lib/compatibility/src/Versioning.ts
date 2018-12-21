import { Autowired, Binding, Param } from '@exteranto/ioc'
import { VersionResolver } from './VersionResolver'

@Binding
export class Versioning {
  /**
   * The current app version.
   *
   * @var {string}
   */
  @Param('app.version')
  private version: string

  /**
   * The version resolver implementation.
   *
   * @var {VersionResolver}
   */
  @Autowired
  private resolver: VersionResolver

  /**
   * Perform this action since the provided version. Inclusive.
   *
   * @param {string} version
   * @param {() => any} callback
   * @return {Promise<any>}
   */
  public async since (version: string, callback: () => any) : Promise<any> {
    if (this.resolver.equal(this.version, version) || this.resolver.higher(this.version, version)) {
      return callback()
    }
  }

  /**
   * Perform this action until the provided version. Inclusive.
   *
   * @param {string} version
   * @param {() => any} callback
   * @return {Promise<any>}
   */
  public async until (version: string, callback: () => any) : Promise<any> {
    if (this.resolver.equal(this.version, version) || this.resolver.lower(this.version, version)) {
      return callback()
    }
  }
}
