import { NotImplementedException } from '@exteranto/exceptions'
import { Autowired, Dispatcher, Browser, Provider } from '@exteranto/core'

import { Runtime } from './Runtime'
import { Runtime as ChromeRuntime } from './chrome/Runtime'
import { Runtime as SafariRuntime } from './safari/Runtime'
import { Runtime as ExtensionsRuntime } from './extensions/Runtime'

export class RuntimeProvider extends Provider {

  /**
   * Autowires dispatcher
   *
   * @var {Dispatcher}
   */
  @Autowired
  private dispatcher: Dispatcher

  /**
   * Boot the provider services.
   *
   * @param {any} container
   */
  public boot () : void {

    /**
     * Binding the runtime service to the IOC container.
     */

    this.container.bind(ChromeRuntime)
    .to(Runtime).for(Browser.CHROME)

    this.container.bind(ExtensionsRuntime)
      .to(Runtime).for(Browser.EXTENSIONS)

    this.container.bind(SafariRuntime)
      .to(Runtime).for(Browser.SAFARI)

    if (this.container.resolveParam('browser') === Browser.SAFARI) {
      console.warn(new NotImplementedException(
        '@exteranto/runtime', 'setUninstallUrl',
      ))
    }
  }

  /**
   * Register the provider services.
   */
  public register () : void {
    this.container.resolve(Runtime)
      .registerEvents(this.dispatcher)
  }
}
