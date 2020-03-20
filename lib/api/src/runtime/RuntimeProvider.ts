import { NotImplementedException } from '@internal/exceptions'
import { Browser, Dispatcher, Provider, Script } from '@exteranto/core'

import { Runtime } from './Runtime'
import { Runtime as ChromeRuntime } from './chrome/Runtime'
import { Runtime as SafariRuntime } from './safari/Runtime'
import { Runtime as ExtensionsRuntime } from './extensions/Runtime'

export class RuntimeProvider extends Provider {

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
    this.container.bind<Runtime>(ChromeRuntime).to(Runtime).for(Browser.CHROME)
    // this.container.bind<Runtime>(ChromeRuntime).to(Runtime).for(Browser.EDGE)
    this.container.bind<Runtime>(ExtensionsRuntime).to(Runtime).for(Browser.EXTENSIONS)
    this.container.bind<Runtime>(SafariRuntime).to(Runtime).for(Browser.SAFARI)

    if (this.container.resolveParam<Browser>('browser') === Browser.SAFARI) {
      console.warn(new NotImplementedException(
        '@exteranto/api', 'Runtime', 'setUninstallUrl',
      ))
    }
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    this.container.resolve<Runtime>(Runtime).registerEvents(
      this.container.resolve<Dispatcher>(Dispatcher),
    )
  }

}
