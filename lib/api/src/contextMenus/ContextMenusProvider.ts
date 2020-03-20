import { Provider, Script, Browser } from '@exteranto/core'
import { NotImplementedException } from '@internal/exceptions'

import { ContextMenus } from './ContextMenus'
import { ContextMenus as ChromeContextMenus } from './chrome/ContextMenus'
import { ContextMenus as SafariContextMenus } from './safari/ContextMenus'
import { ContextMenus as ExtensionsContextMenus } from './extensions/ContextMenus'

export class ContextMenusProvider extends Provider {

  /**
   * {@inheritdoc}
   */
  public only () : Script[] {
    return [Script.BACKGROUND]
  }

  /**
   * {@inheritdoc}
   */
  public boot () : void {
    this.container.bind(ChromeContextMenus).to(ContextMenus).for(Browser.CHROME)
    // this.container.bind(ChromeContextMenus).to(ContextMenus).for(Browser.EDGE)
    this.container.bind(ExtensionsContextMenus).to(ContextMenus).for(Browser.EXTENSIONS)
    this.container.bind(SafariContextMenus).to(ContextMenus).for(Browser.SAFARI)

    if (this.container.resolveParam<Browser>('browser') === Browser.SAFARI) {
      return console.warn(new NotImplementedException('@exteranto/api', 'Context Menus'))
    }
  }

  /**
   * {@inheritdoc}
   */
  public register () : void {
    //
  }

}
