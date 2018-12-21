import { Browser, Provider } from '@exteranto/support'
import { Messaging as ChromeMessaging } from './chrome/Messaging'
import { Messaging as ExtensionsMessaging } from './extensions/Messaging'
import { Messaging } from './Messaging'
import { Messaging as SafariMessaging } from './safari/Messaging'

export class MessagingProvider extends Provider {
  /**
   * Register the provider services.
   *
   * @param {any} container
   */
  public register (container: any) : void {
    container.bind(ChromeMessaging).to(Messaging).for(Browser.CHROME)
    container.bind(ExtensionsMessaging).to(Messaging).for(Browser.EXTENSIONS)
    container.bind(SafariMessaging).to(Messaging).for(Browser.SAFARI)
  }
}
