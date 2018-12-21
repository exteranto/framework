import { Binding, Param } from '@exteranto/ioc'
import { Browser } from '@exteranto/support'

@Binding
export class Comb {
  /**
   * The current browser.
   *
   * @var {Browser}
   */
  @Param('browser')
  private browser: Browser

  /**
   * The result passed to the last method in the chain.
   *
   * @var {any}
   */
  private result: any

  /**
   * Performs an action only on a specific set of browsers.
   *
   * @param {Browser[]} browsers
   * @param {() => any} callback
   * @return {Comb}
   */
  public only (browsers: Browser[], callback: () => any) : Comb {
    if (browsers.filter(i => i === this.browser).length === 1) {
      this.result = callback()
    }

    return this
  }

  /**
   * Method this.only alias.
   *
   * @param {Browser[]} browsers
   * @param {() => any} callback
   * @return {Comb}
   */
  public thenOnly (browsers: Browser[], callback: () => any) : Comb {
    return this.only(browsers, callback)
  }

  /**
   * Performs an action on all browsers but the specified ones.
   *
   * @param {Browser[]} browsers
   * @param {() => any} callback
   * @return {Comb}
   */
  public except (browsers: Browser[], callback: () => any) : Comb {
    if (browsers.filter(i => i === this.browser).length === 0) {
      this.result = callback()
    }

    return this
  }

  /**
   * Method this.except alias.
   *
   * @param {Browser[]} browsers
   * @param {() => any} callback
   * @return {Comb}
   */
  public thenExcept (browsers: Browser[], callback: () => any) : Comb {
    return this.except(browsers, callback)
  }

  /**
   * Finishing method that contains the result.
   *
   * @param {(result: any) => any} callback
   * @return {Comb}
   */
  public async then (callback: (result: any) => any) : Promise<any> {
    return callback(this.result)
  }
}
