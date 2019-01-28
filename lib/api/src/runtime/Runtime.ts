import { Dispatcher, RegistersNativeEvents } from '@exteranto/core'

export abstract class Runtime implements RegistersNativeEvents {

  /**
   * Sets the link that is opened once the extension is uninstalled.
   *
   * @param url A valid url
   */
  public abstract async setUninstallUrl (url: string) : Promise<void>

  /**
   * Register all native events on the given module.
   *
   * @param dispatcher Dispatcher resolved from container
   */
  public abstract registerEvents (dispatcher: Dispatcher) : void
}
