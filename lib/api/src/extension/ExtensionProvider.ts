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
    this.container.bind(ChromeExtension).to(Extension).for(Browser.CHROME)
    this.container.bind(ExtensionsExtension).to(Extension).for(Browser.EXTENSIONS)
    this.container.bind(SafariExtension).to(Extension).for(Browser.SAFARI)
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    //
  }

}
