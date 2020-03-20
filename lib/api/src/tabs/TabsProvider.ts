import { Browser, Dispatcher, Provider, Script } from '@exteranto/core'

import { Tabs } from './Tabs'
import { Tabs as ChromeTabs } from './chrome/Tabs'
import { Tabs as ExtensionsTabs } from './extensions/Tabs'
import { Tabs as SafariTabs } from './safari/Tabs'

export class TabsProvider extends Provider {

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
    this.container.bind<Tabs>(ChromeTabs).to(Tabs).for(Browser.CHROME)
    // this.container.bind<Tabs>(ChromeTabs).to(Tabs).for(Browser.EDGE)
    this.container.bind<Tabs>(ExtensionsTabs).to(Tabs).for(Browser.EXTENSIONS)
    this.container.bind<Tabs>(SafariTabs).to(Tabs).for(Browser.SAFARI)
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    this.container.resolve<Tabs>(Tabs).registerEvents(
      this.container.resolve<Dispatcher>(Dispatcher),
    )
  }

}
