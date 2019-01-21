import { Browser, Provider } from '@exteranto/core'

import { Messaging } from './Messaging'
import { Messaging as ChromeMessaging } from './chrome/Messaging'
import { Messaging as ExtensionsMessaging } from './extensions/Messaging'
import { Messaging as SafariMessaging } from './safari/Messaging'

export class MessagingProvider extends Provider {

  /**
   * Boot the provider services.
   */
  public boot () : void {
    this.container.bind(ChromeMessaging).to(Messaging).for(Browser.CHROME)
    this.container.bind(ExtensionsMessaging).to(Messaging).for(Browser.EXTENSIONS)
    this.container.bind(SafariMessaging).to(Messaging).for(Browser.SAFARI)
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    //
  }
}
