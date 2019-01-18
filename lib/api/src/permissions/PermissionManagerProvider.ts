import { Autowired, Dispatcher, Browser, Provider } from '@exteranto/core'

import { PermissionManager } from './PermissionManager'
import { PermissionManager as ChromePermissionManager } from './chrome/PermissionManager'
import { PermissionManager as SafariPermissionManager } from './safari/PermissionManager'
import { PermissionManager as ExtensionsPermissionManager } from './extensions/PermissionManager'

export class PermissionManagerProvider extends Provider {

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
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    //
  }
}
