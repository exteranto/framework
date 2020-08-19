import { Browser, Provider } from '@exteranto/core'

import { Extension } from './Extension'
import { Extension as ChromeExtension } from './chrome/Extension'
import { Extension as SafariExtension } from './safari/Extension'
import { Extension as ExtensionsExtension } from './extensions/Extension'

export class ExtensionProvider extends Provider {

  /**
   * Boot the provider services.
   */
  public boot () : void {
    this.container.bind<Extension>(ChromeExtension).to(Extension).for(Browser.CHROME)
    this.container.bind<Extension>(ChromeExtension).to(Extension).for(Browser.EDGE)
    this.container.bind<Extension>(ExtensionsExtension).to(Extension).for(Browser.FIREFOX)
    this.container.bind<Extension>(SafariExtension).to(Extension).for(Browser.SAFARI)
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    //
  }

}
