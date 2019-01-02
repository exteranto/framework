import { Dispatcher, RegistersNativeEvents } from '@exteranto/events'

export abstract class Runtime implements RegistersNativeEvents {

  /**
   * Sets the link that is opened once the extension is uninstalled.
   *
   * @param {string} url
   * @return {Promise<void>}
   */
  public abstract setUninstallUrl (url: string) : Promise<void>

  /**
   * Register all native events on the given module.
   *
   * @param {Dispatcher} dispatcher
   */
  public abstract registerEvents (dispatcher: Dispatcher) : void
}
