import { NotImplementedException } from '@exteranto/exceptions'
import { Autowired, Dispatcher, Browser, Provider } from '@exteranto/core'

import { PermissionManager } from './permissions/PermissionManager'
import { PermissionManager as ChromePermissionManager } from './permissions/chrome/PermissionManager'
import { PermissionManager as SafariPermissionManager } from './permissions/safari/PermissionManager'
import { PermissionManager as ExtensionsPermissionManager } from './permissions/extensions/PermissionManager'

import { BrowserAction } from './browserAction/BrowserAction'
import { BrowserAction as ChromeBrowserAction } from './browserAction/chrome/BrowserAction'
import { BrowserAction as SafariBrowserAction } from './browserAction/safari/BrowserAction'
import { BrowserAction as ExtensionsBrowserAction } from './browserAction/extensions/BrowserAction'

import { Runtime } from './runtime/Runtime'
import { Runtime as ChromeRuntime } from './runtime/chrome/Runtime'
import { Runtime as SafariRuntime } from './runtime/safari/Runtime'
import { Runtime as ExtensionsRuntime } from './runtime/extensions/Runtime'

export class ManagementProvider extends Provider {

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

    /**
     * Binding the runtime service to the IOC container.
     */

    this.container.bind(ChromeRuntime)
    .to(Runtime).for(Browser.CHROME)

    this.container.bind(ExtensionsRuntime)
      .to(Runtime).for(Browser.EXTENSIONS)

    this.container.bind(SafariRuntime)
      .to(Runtime).for(Browser.SAFARI)

    if (this.container.resolveParam('browser') === Browser.SAFARI) {
      console.warn(new NotImplementedException(
        '@exteranto/management', 'Runtime', 'setUninstallUrl',
      ))
    }
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    this.container.resolve(Runtime)
      .registerEvents(this.dispatcher)

    this.container.resolve(BrowserAction)
      .registerEvents(this.dispatcher)
  }
}
