import { Browser, Provider } from '@exteranto/support'
import { Cookies } from './Cookies'
import { Cookies as ChromeCookies } from './chrome/Cookies'
import { Cookies as ExtensionsCookies } from './extensions/Cookies'
import { Dispatcher } from '@exteranto/events'
import { NotImplementedException } from '@exteranto/exceptions'

export class CookiesProvider extends Provider {

  /**
   * Boot the provider services.
   */
  public boot () : void {
    this.container.bind(ChromeCookies).to(Cookies).for(Browser.CHROME)
    this.container.bind(ExtensionsCookies).to(Cookies).for(Browser.EXTENSIONS)

    if (Browser.SAFARI) {
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
