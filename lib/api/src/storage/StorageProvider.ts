import { Browser, Provider, Script } from '@exteranto/core'

import { Storage } from './Storage'
import { StorageType } from './StorageType'
import { MemoryStorage } from './MemoryStorage'
import { SyncStorage as ChromeSyncStorage } from './chrome/SyncStorage'
import { SyncStorage as SafariSyncStorage } from './safari/SyncStorage'
import { LocalStorage as ChromeLocalStorage } from './chrome/LocalStorage'
import { LocalStorage as SafariLocalStorage } from './safari/LocalStorage'
import { SyncStorage as ExtensionsSyncStorage } from './extensions/SyncStorage'
import { LocalStorage as ExtensionsLocalStorage } from './extensions/LocalStorage'

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
    this.container.bind<Storage>(ChromeLocalStorage)
      .to(Storage).for(Browser.CHROME).tag('type', StorageType.LOCAL)
    this.container.bind<Storage>(ChromeSyncStorage)
      .to(Storage).for(Browser.CHROME).tag('type', StorageType.SYNC)

    // this.container.bind<Storage>(ChromeLocalStorage)
    //   .to(Storage).for(Browser.EDGE).tag('type', StorageType.LOCAL)
    // this.container.bind<Storage>(ChromeSyncStorage)
    //   .to(Storage).for(Browser.EDGE).tag('type', StorageType.SYNC)

    this.container.bind<Storage>(ExtensionsLocalStorage)
      .to(Storage).for(Browser.EXTENSIONS).tag('type', StorageType.LOCAL)
    this.container.bind<Storage>(ExtensionsSyncStorage)
      .to(Storage).for(Browser.EXTENSIONS).tag('type', StorageType.SYNC)

    this.container.bind<Storage>(SafariLocalStorage)
      .to(Storage).for(Browser.SAFARI).tag('type', StorageType.LOCAL)
    this.container.bind<Storage>(SafariSyncStorage)
      .to(Storage).for(Browser.SAFARI).tag('type', StorageType.SYNC)

    this.container.bind<Storage>(MemoryStorage)
      .to(Storage).tag('type', StorageType.MEMORY)
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    //
  }

}
