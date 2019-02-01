import { Browser, Provider, Script } from '@exteranto/core'

import { Messaging } from './Messaging'
import { Messaging as ChromeMessaging } from './chrome/Messaging'
import { Messaging as ExtensionsMessaging } from './extensions/Messaging'
import { Messaging as SafariMessaging } from './safari/Messaging'

export class MessagingProvider extends Provider {

  /**
   * The scripts that this provider should be registered for.
   *
   * @return Array of Script enums that this provider should be registered for
   */
  public only () : Script[] {
    return [Script.CONTENT]
  }

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
