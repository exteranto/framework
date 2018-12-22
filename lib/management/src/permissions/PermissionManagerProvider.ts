import { Browser, Provider } from '@exteranto/support'
import { PermissionManager as ChromePermissionManager } from './chrome/PermissionManager'
import { PermissionManager as ExtensionsPermissionManager } from './extensions/PermissionManager'
import { PermissionManager } from './PermissionManager'
import { PermissionManager as SafariPermissionManager } from './safari/PermissionManager'

export class PermissionManagerProvider extends Provider {
  /**
   * Boot the provider services.
   */
  public boot () : void {
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
