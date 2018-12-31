import { Dispatcher, RegistersNativeEvents } from '@exteranto/events'

export abstract class Runtime implements RegistersNativeEvents {
  /**
   * Sets the link that is opened once the extension is uninstalled.
   *
   * @param {string} url
   * @return {Promise<void>}
   */
  public abstract setUninstallLink (url: string) : Promise<void>

  /**
   * @inheritdoc
   */
  public abstract registerEvents(dispatcher: Dispatcher): void
}
