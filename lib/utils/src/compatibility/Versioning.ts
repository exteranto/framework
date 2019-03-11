import { VersionResolver } from './VersionResolver'
import { Autowired, Binding, Param } from '@exteranto/core'
import { VersionNotMatchedException } from '@internal/compatibility/exceptions'

@Binding
export class Versioning {

  /**
   * The current app version.
   */
  @Param('app.version')
  private version: string

  /**
   * The version resolver implementation.
   */
  @Autowired
  private resolver: VersionResolver

  /**
   * Perform this action since the provided version. Inclusive.
   *
   * @param version The version to check agains
   * @param callback The callback to be invoked if constraints pass
   * @return The callback return value if version matched
   * @throws {VersionNotMatchedException}
   */
  public async since (version: string, callback: () => any) : Promise<any> {
    if (this.resolver.equal(this.version, version) || this.resolver.higher(this.version, version)) {
      return callback()
    }

    return Promise.reject(new VersionNotMatchedException())
  }

  /**
   * Perform this action until the provided version. Inclusive.
   *
   * @param version The version to check agains
   * @param callback The callback to be invoked if constraints pass
   * @return The callback return value if version matched
   * @throws {VersionNotMatchedException}
   */
  public async until (version: string, callback: () => any) : Promise<any> {
    if (this.resolver.equal(this.version, version) || this.resolver.lower(this.version, version)) {
      return callback()
    }

    return Promise.reject(new VersionNotMatchedException())
  }

}
