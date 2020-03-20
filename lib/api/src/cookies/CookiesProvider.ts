import { NotImplementedException } from '@internal/exceptions'
import { Browser, Dispatcher, Provider, Script } from '@exteranto/core'

import { Cookies } from './Cookies'
import { Cookies as ChromeCookies } from './chrome/Cookies'
import { Cookies as SafariCookies } from './safari/Cookies'
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
    this.container.bind<Cookies>(ChromeCookies).to(Cookies).for(Browser.CHROME)
    // this.container.bind<Cookies>(ChromeCookies).to(Cookies).for(Browser.EDGE)
    this.container.bind<Cookies>(ExtensionsCookies).to(Cookies).for(Browser.EXTENSIONS)
    this.container.bind<Cookies>(SafariCookies).to(Cookies).for(Browser.SAFARI)

    if (this.container.resolveParam<Browser>('browser') === Browser.SAFARI) {
      return console.warn(new NotImplementedException('@exteranto/api', 'Cookies'))
    }
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    this.container.resolve<Cookies>(Cookies).registerEvents(
      this.container.resolve<Dispatcher>(Dispatcher),
    )
  }

}
