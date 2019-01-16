import { Singleton } from '@exteranto/ioc'

@Singleton
export class VersionResolver {
  /**
   * Checks if the version numbers are equal.
   *
   * @param {string} version
   * @param {string} comparison
   * @return {boolean}
   */
  public equal (version: string, comparison: string) : boolean {
    return this.integerify(version) === this.integerify(comparison)
  }

  /**
   * Checks if the version is higher than the provided comparison.
   *
   * @param {string} version
   * @param {string} comparison
   * @return {boolean}
   */
  public higher (version: string, comparison: string) : boolean {
    return this.integerify(version) > this.integerify(comparison)
  }

  /**
   * Checks if the version is lower than the provided comparison.
   *
   * @param {string} version
   * @param {string} comparison
   * @return {boolean}
   */
  public lower (version: string, comparison: string) : boolean {
    return this.integerify(version) < this.integerify(comparison)
  }

  /**
   * Integerify the provided version string.
   *
   * @param {string} version
   * @return {number}
   */
  private integerify (version: string) : number {
    return version.split('.').reduce((carry, fragment, index) => {
      return carry += parseInt(fragment, 10) * Math.pow(10, 4 - index * 2)
    }, 0)
  }
}
