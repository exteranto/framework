import { Browser, Provider } from '@exteranto/support'
import { Cookies } from './Cookies'
import { Cookies as ChromeCookies } from './chrome/Cookies'
import { Cookies as ExtensionsCookies } from './extensions/Cookies'
import { NotImplementedException } from '@exteranto/exceptions'
import { Permission, HasAccessTo } from '@exteranto/management'

export class CookiesProvider extends Provider {

  /**
   * Boot the provider services.
   */
  @HasAccessTo(Permission.COOKIES)
  public boot () : void {
    this.container.bind(ChromeCookies).to(Cookies).for(Browser.CHROME)
    this.container.bind(ExtensionsCookies).to(Cookies).for(Browser.EXTENSIONS)

    // Browser.SAFARI && new NotImplementedException('Cookies APIs')
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    //
  }
}
