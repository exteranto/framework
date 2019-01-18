import { Autowired, Dispatcher, Browser, Provider } from '@exteranto/core'

import { BrowserAction } from './BrowserAction'
import { BrowserAction as ChromeBrowserAction } from './chrome/BrowserAction'
import { BrowserAction as SafariBrowserAction } from './safari/BrowserAction'
import { BrowserAction as ExtensionsBrowserAction } from './extensions/BrowserAction'

export class BrowserActionProvider extends Provider {

  /**
   * Autowires dispatcher
   *
   * @var {Dispatcher}
   */
  @Autowired
  private dispatcher: Dispatcher

  /**
   * Boot the provider services.
   *
   * @param {any} container
   */
  public boot () : void {

    /**
     * Binding the browser action service to the IOC container.
     */

    this.container.bind(ChromeBrowserAction)
      .to(BrowserAction).for(Browser.CHROME)

    this.container.bind(ExtensionsBrowserAction)
      .to(BrowserAction).for(Browser.EXTENSIONS)

    this.container.bind(SafariBrowserAction)
      .to(BrowserAction).for(Browser.SAFARI)
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    this.container.resolve(BrowserAction)
      .registerEvents(this.dispatcher)
  }
}
