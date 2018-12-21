import { Dispatcher } from '@exteranto/events'
import { Browser, Provider, Script } from '@exteranto/support'
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
   * Register the provider services.
   *
   * @param {any} container
   */
  public register (container: any) : void {
    container.bind(ChromeTabs).to(Tabs).for(Browser.CHROME)
    container.bind(ExtensionsTabs).to(Tabs).for(Browser.EXTENSIONS)
    container.bind(SafariTabs).to(Tabs).for(Browser.SAFARI)

    container.resolve(Tabs).registerEvents(
      container.resolve(Dispatcher),
    )
  }

  /**
   * Register all native events on the given module.
   *
   * @param {Dispatcher} dispatcher
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    //
  }
}
