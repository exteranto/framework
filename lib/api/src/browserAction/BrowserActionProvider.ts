import { Browser, Dispatcher, Provider, Script } from '@exteranto/core'

import { BrowserAction } from './BrowserAction'
import { BrowserAction as ChromeBrowserAction } from './chrome/BrowserAction'
import { BrowserAction as SafariBrowserAction } from './safari/BrowserAction'
import { BrowserAction as ExtensionsBrowserAction } from './extensions/BrowserAction'

export class BrowserActionProvider extends Provider {

  /**
   * The scripts that this provider should be registered for.
   *
   * @return Array of Script enums that this provider should be registered for
   */
  public only () : Script[] {
    return [Script.BACKGROUND]
  }

  /**
   * Boot the provider services.
   */
  public boot () : void {
    this.container.bind(ChromeBrowserAction).to(BrowserAction).for(Browser.CHROME)
    this.container.bind(ExtensionsBrowserAction).to(BrowserAction).for(Browser.EXTENSIONS)
    this.container.bind(SafariBrowserAction).to(BrowserAction).for(Browser.SAFARI)
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    this.container.resolve(BrowserAction).registerEvents(
      this.container.resolve(Dispatcher),
    )
  }

}
