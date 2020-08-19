import { Browser, Provider } from '@exteranto/core'

import { Identity } from './Identity'
import { Identity as ChromeIdentity } from './chrome/Identity'
import { Identity as ExtensionsIdentity } from './extensions/Identity'

export class IdentityProvider extends Provider {

  /**
   * Boot the provider services.
   */
  public boot () : void {
    this.container.bind<Identity>(ChromeIdentity).to(Identity).for(Browser.CHROME)
    this.container.bind<Identity>(ChromeIdentity).to(Identity).for(Browser.EDGE)
    this.container.bind<Identity>(ExtensionsIdentity).to(Identity).for(Browser.FIREFOX)
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    //
  }

}
