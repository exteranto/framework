import { Browser, Provider } from '@exteranto/support'

import { PermissionManager } from './permissions/PermissionManager'
import { PermissionManager as ChromePermissionManager } from './permissions/chrome/PermissionManager'
import { PermissionManager as SafariPermissionManager } from './permissions/safari/PermissionManager'
import { PermissionManager as ExtensionsPermissionManager } from './permissions/extensions/PermissionManager'

import { BrowserAction } from './browserAction/BrowserAction'
import { BrowserAction as ChromeBrowserAction } from './browserAction/chrome/BrowserAction'
import { BrowserAction as SafariBrowserAction } from './browserAction/safari/BrowserAction'
import { BrowserAction as ExtensionsBrowserAction } from './browserAction/extensions/BrowserAction'

export class ManagementProvider extends Provider {
  /**
   * Boot the provider services.
   *
   * @param {any} container
   */
  public boot () : void {

    /**
     * Binding the permissions service to the IOC container.
     */

    this.container.bind(ChromePermissionManager)
      .to(PermissionManager).for(Browser.CHROME)

    this.container.bind(ExtensionsPermissionManager)
      .to(PermissionManager).for(Browser.EXTENSIONS)

    this.container.bind(SafariPermissionManager)
      .to(PermissionManager).for(Browser.SAFARI)

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
    //
  }
}
