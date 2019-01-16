import { Dispatcher } from '@exteranto/core'
import { Browser, Provider, Script } from '@exteranto/core'
import { Tabs as ChromeTabs } from './chrome/Tabs'
import { Tabs as ExtensionsTabs } from './extensions/Tabs'
import { Tabs as SafariTabs } from './safari/Tabs'
import { Tabs } from './Tabs'

export class TabsProvider extends Provider {
  /**
   * The scripts that this provider should be registered for.
   *
   * @return {Script[]}
   */
  public only () : Script[] {
    return [Script.BACKGROUND, Script.POPUP]
  }

  /**
   * Boot the provider services.
   */
  public boot () : void {
    this.container.bind(ChromeTabs).to(Tabs).for(Browser.CHROME)
    this.container.bind(ExtensionsTabs).to(Tabs).for(Browser.EXTENSIONS)
    this.container.bind(SafariTabs).to(Tabs).for(Browser.SAFARI)
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    this.container.resolve(Tabs).registerEvents(
      this.container.resolve(Dispatcher),
    )
  }
}
