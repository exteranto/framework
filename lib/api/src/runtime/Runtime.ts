import { Dispatcher, RegistersNativeEvents } from '@exteranto/core'

export abstract class Runtime implements RegistersNativeEvents {

  /**
   * Sets the link that is opened once the extension is uninstalled.
   *
   * @param {string} url
   * @return {Promise<void>}
   */
  public abstract setUninstallUrl (url: string) : Promise<void>

  /**
   * Converts a relative path within extension file tree to a URL.
   *
   * @param {string} path
   */
  // TODO: Make sure the url points to the same directory in all browsers.
  public abstract extensionUrl (path?: string) : string

  /**
   * Register all native events on the given module.
   *
   * @param {Dispatcher} dispatcher
   */
  public abstract registerEvents (dispatcher: Dispatcher) : void
}
