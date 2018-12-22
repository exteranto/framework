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
   * Register the provider services.
   *
   * @param {any} container
   */
  public register (container: any) : void {

    /**
     * Binding the permissions service to the IOC container.
     */

    container.bind(ChromePermissionManager)
      .to(PermissionManager).for(Browser.CHROME)

    container.bind(ExtensionsPermissionManager)
      .to(PermissionManager).for(Browser.EXTENSIONS)

    container.bind(SafariPermissionManager)
      .to(PermissionManager).for(Browser.SAFARI)

    /**
     * Binding the browser action service to the IOC container.
     */

    container.bind(ChromeBrowserAction)
      .to(BrowserAction).for(Browser.CHROME)

    container.bind(ExtensionsBrowserAction)
      .to(BrowserAction).for(Browser.EXTENSIONS)

    container.bind(SafariBrowserAction)
      .to(BrowserAction).for(Browser.SAFARI)
  }
}
