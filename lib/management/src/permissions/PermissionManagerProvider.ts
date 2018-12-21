import { Browser, Provider } from '@exteranto/support'
import { PermissionManager as ChromePermissionManager } from './chrome/PermissionManager'
import { PermissionManager as ExtensionsPermissionManager } from './extensions/PermissionManager'
import { PermissionManager } from './PermissionManager'
import { PermissionManager as SafariPermissionManager } from './safari/PermissionManager'

export class PermissionManagerProvider extends Provider {
  /**
   * Register the provider services.
   *
   * @param {any} container
   */
  public register (container: any) : void {
    container.bind(ChromePermissionManager)
      .to(PermissionManager).for(Browser.CHROME)

    container.bind(ExtensionsPermissionManager)
      .to(PermissionManager).for(Browser.EXTENSIONS)

    container.bind(SafariPermissionManager)
      .to(PermissionManager).for(Browser.SAFARI)
  }
}
