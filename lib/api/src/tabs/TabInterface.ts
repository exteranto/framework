import { Message } from '@internal/messaging'

export interface TabInterface {

  /**
   * Retrieves the tab id.
   *
   * @return Tab id to use for APIs interaction
   */
  id () : number

  /**
   * Retrieves the tab url.
   *
   * @return Resolves with current url
   * @throws {TabIdUnknownException}
   */
  url () : Promise<string>

  /**
   * Closes the tab.
   */
  close () : Promise<void>

  /**
   * Reloads the tab.
   *
   * @return Resolves with itself
   * @throws {TabIdUnknownException}
   */
  reload () : Promise<TabInterface>

  /**
   * Duplicates the tab.
   *
   * @return Resolves with new tab instance
   * @throws {TabIdUnknownException}
   */
  duplicate () : Promise<TabInterface>

  /**
   * Marks tab as active.
   *
   * @return Resolves with itself
   * @throws {TabIdUnknownException}
   */
  activate () : Promise<TabInterface>

  /**
   * Pins a tab.
   *
   * @param pinned Whether this tab should be pinned (default true)
   * @return Resolves with itself
   * @throws {TabIdUnknownException}
   */
  pin (pinned?: boolean) : Promise<TabInterface>

  /**
   * Unpins a tab.
   *
   * @return Resolves with itself
   * @throws {TabIdUnknownException}
   */
  unpin () : Promise<TabInterface>

  /**
   * Returns favicon url.
   *
   * @return Favicon url path of a tab
   * @throws {TabIdUnknownException}
   * @throws {TabHasNoFaviconException}
   */
  favicon () : Promise<string>

  /**
   * Returns the webpage title.
   *
   * @return Title of the webpage
   * @throws {TabIdUnknownException}
   */
  title () : Promise<string>

  /**
   * Sends a message to the tab.
   *
   * @param message Message with payload
   * @return Resolves with response data
   * @throws {ConnectionRefusedException} If the connection could not be
   * established
   */
  send (message: Message) : Promise<any>

  /**
   * Resolves a value from the original cached tab object. Note that values on
   * this object might not be cross-browser compatible.
   *
   * @param key Key in the tab information object
   * @return Associated value if any
   */
  raw (key: string) : any

}
