import { RegistersNativeEvents, Dispatcher } from '@exteranto/core'

export abstract class BrowserAction implements RegistersNativeEvents {

  /**
   * Getter for the badge text.
   *
   * @param tabId Id of the target tab
   * @return Resolves with badge string
   * @throws {TabIdUnknownException} No tab with given id
   */
  public abstract async getBadgeText (tabId: number) : Promise<string>

  /**
   * Setter for the badge text.
   *
   * @param text Text to be assigned to the tab badge
   * @param tabId Id of the target tab
   * @throws {TabIdUnknownException} No tab with given id
   */
  public abstract async setBadgeText (text: string, tabId: number) : Promise<void>

  /**
   * Getter for the badge color.
   *
   * @safari This is just a placeholder as there are no badge colours.
   *
   * @param tabId Id of the target tab
   * @return Resolves with number array in format [R, G, B, A]
   */
  public abstract async getBadgeColor (tabId: number) : Promise<number[]>

  /**
   * Setter for the badge color.
   *
   * @safari This is just a placeholder as there are no badge colours.
   *
   * @param color Number array in format [R, G, B, A]
   * @param tabId Id of the target tab
   * @throws {TabIdUnknownException}
   */
  public abstract async setBadgeColor (color: number[], tabId: number) : Promise<void>

  /**
   * Get the title at a specified tab.
   *
   * @param tabId Id of the target tab
   * @return Resolves with current webpage title
   * @throws {TabIdUnknownException}
   */
  public abstract async getTitle (tabId: number) : Promise<string>

  /**
   * Set the title at a specified tab.
   *
   * @param title Current webpage title
   * @param tabId Id of the target tab
   * @throws {TabIdUnknownException}
   */
  public abstract async setTitle (title: string, tabId: number) : Promise<void>

  /**
   * Set the icon at a specified tab.
   *
   * @param path A relative path or ImageData object of paths
   * @param tabId Id of the target tab
   * @throws {TabIdUnknownException}
   */
  public abstract async setIcon (path: string | object, tabId: number) : Promise<void>

  /**
   * Register all native events on the given module.
   *
   * @param dispatcher Dispatcher resolved from container
   */
  public abstract registerEvents (dispatcher: Dispatcher) : void
}
