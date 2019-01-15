import { Cookies } from './Cookies'
import { Dispatcher } from '@exteranto/events'
import { Browser, Provider } from '@exteranto/support'
import { NotImplementedException } from '@exteranto/exceptions'

import { Cookies as ChromeCookies } from './chrome/Cookies'
import { Cookies as ExtensionsCookies } from './extensions/Cookies'

export class CookiesProvider extends Provider {

  /**
   * Boot the provider services.
   */
  public boot () : void {
    this.container.bind(ChromeCookies).to(Cookies).for(Browser.CHROME)
    this.container.bind(ExtensionsCookies).to(Cookies).for(Browser.EXTENSIONS)

    if (this.container.resolveParam('browser') === Browser.SAFARI) {
      console.warn(new NotImplementedException('@exteranto/cookies'))
    }
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    this.container.resolve(Cookies).registerEvents(
      this.container.resolve(Dispatcher),
    )
  }
}
