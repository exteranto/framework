import { RegistersNativeEvents, Dispatcher } from '@exteranto/events'

export abstract class BrowserAction implements RegistersNativeEvents {

  /**
   * Getter for the badge text.
   *
   * @param {number} tabId
   * @return {Promise<string>}
   */
  public abstract async getBadgeText (tabId: number) : Promise<string>

  /**
   * Setter for the badge text.
   *
   * @param {string} text
   * @param {number} tabId
   * @return {Promise<void>}
   */
  public abstract async setBadgeText (text: string, tabId: number) : Promise<void>

  /**
   * Getter for the badge color.
   *
   * @param {number} tabId
   * @return {Promise<string>}
   */
  public abstract async getBadgeColor (tabId?: number) : Promise<string>

  /**
   * Setter for the badge color.
   *
   * @param {string} color
   * @param {number} tabId
   * @return {Promise<void>}
   */
  public abstract async setBadgeColor (color: string, tabId?: number) : Promise<void>

  /**
   * Get the title at a specified tab.
   *
   * @param {number} tabId
   * @return {Promise<any>}
   */
  public abstract async getTitle (tabId: number) : Promise<any>

  /**
   * Set the title at a specified tab.
   *
   * @param {string} title
   * @param {number} tabId
   * @return {Promise<any>}
   */
  public abstract async setTitle (title: string, tabId: number) : Promise<any>

  /**
   * Set the icon at a specified tab.
   *
   * @param {string | object} path
   * @param {number} tabId
   * @return {Promise<any>}
   */
  public abstract async setIcon (path: string | object, tabId: number) : Promise<any>

  /**
   * Register all native events on the given module.
   *
   * @param {Dispatcher} dispatcher
   */
  public abstract registerEvents (dispatcher: Dispatcher) : void
}
