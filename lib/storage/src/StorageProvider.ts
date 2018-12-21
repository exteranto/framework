import { Browser, Provider } from '@exteranto/support'
import { Storage as ChromeStorage } from './chrome/Storage'
import { Storage as ExtensionsStorage } from './extensions/Storage'
import { Storage as SafariStorage } from './safari/Storage'
import { Storage } from './Storage'

export class StorageProvider extends Provider {
  /**
   * Register the provider services.
   *
   * @param {any} container
   */
  public register (container: any) : void {
    container.bind(ChromeStorage).to(Storage).for(Browser.CHROME)
    container.bind(ExtensionsStorage).to(Storage).for(Browser.EXTENSIONS)
    container.bind(SafariStorage).to(Storage).for(Browser.SAFARI)
  }
}
