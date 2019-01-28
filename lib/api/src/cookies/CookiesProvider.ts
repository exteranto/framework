import { NotImplementedException } from '@exteranto/exceptions'
import { Browser, Dispatcher, Provider, Script } from '@exteranto/core'

import { Cookies } from './Cookies'
import { Cookies as ChromeCookies } from './chrome/Cookies'
import { Cookies as ExtensionsCookies } from './extensions/Cookies'

export class CookiesProvider extends Provider {

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
    this.container.bind(ChromeCookies).to(Cookies).for(Browser.CHROME)
    this.container.bind(ExtensionsCookies).to(Cookies).for(Browser.EXTENSIONS)
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    if (this.container.resolveParam('browser') === Browser.SAFARI) {
      return console.warn(new NotImplementedException('@exteranto/cookies'))
    }

    this.container.resolve(Cookies).registerEvents(
      this.container.resolve(Dispatcher),
    )
  }
}
