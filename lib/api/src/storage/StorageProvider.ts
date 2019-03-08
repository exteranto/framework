import { Browser, Provider, Script } from '@exteranto/core'

import { Storage } from './Storage'
import { Storage as ChromeStorage } from './chrome/Storage'
import { Storage as ExtensionsStorage } from './extensions/Storage'
import { Storage as SafariStorage } from './safari/Storage'

export class StorageProvider extends Provider {

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
    this.container.bind<Storage>(ChromeStorage).to(Storage).for(Browser.CHROME)
    this.container.bind<Storage>(ExtensionsStorage).to(Storage).for(Browser.EXTENSIONS)
    this.container.bind<Storage>(SafariStorage).to(Storage).for(Browser.SAFARI)
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    //
  }

}
