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
    this.container.bind<Messaging>(ChromeMessaging).to(Messaging).for(Browser.CHROME).asSingleton()
    this.container.bind<Messaging>(ChromeMessaging).to(Messaging).for(Browser.EDGE).asSingleton()
    this.container.bind<Messaging>(ExtensionsMessaging).to(Messaging).for(Browser.FIREFOX).asSingleton()
    this.container.bind<Messaging>(SafariMessaging).to(Messaging).for(Browser.SAFARI).asSingleton()
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    //
  }

}
