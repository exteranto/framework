import { Binding, Param } from '@exteranto/core'
import { Browser } from '@exteranto/core'

@Binding
export class Comb {

  /**
   * The current browser.
   */
  @Param('browser')
  private browser: Browser

  /**
   * The result passed to the last method in the chain.
   */
  private result: any

  /**
   * Performs an action only on a specific set of browsers.
   *
   * @param browsers The constraining browser array
   * @param callback The callback to be invoked when constraints pass
   * @return This class instance for chaining
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
   * @param browsers The constraining browser array
   * @param callback The callback to be invoked when constraints pass
   * @return This class instance for chaining
   */
  public thenOnly (browsers: Browser[], callback: () => any) : Comb {
    return this.only(browsers, callback)
  }

  /**
   * Performs an action on all browsers but the specified ones.
   *
   * @param browsers The constraining browser array
   * @param callback The callback to be invoked when constraints pass
   * @return This class instance for chaining
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
   * @param browsers The constraining browser array
   * @param callback The callback to be invoked when constraints pass
   * @return This class instance for chaining
   */
  public thenExcept (browsers: Browser[], callback: () => any) : Comb {
    return this.except(browsers, callback)
  }

  /**
   * Finishing method that contains the result.
   *
   * @param callback The callback to be invoked with the result
   * @return This class instance for chaining
   */
  public async then (callback: (result: any) => any) : Promise<any> {
    return callback(this.result)
  }

}
