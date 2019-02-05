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
   */
  reload () : Promise<TabInterface>

  /**
   * Duplicates the tab.
   *
   * @return Resolves with new tab instance
   */
  duplicate () : Promise<TabInterface>

  /**
   * Marks tab as active.
   *
   * @return Resolves with itself
   */
  activate () : Promise<TabInterface>

  /**
   * Pins a tab.
   *
   * @param pinned Whether this tab should be pinned (default true)
   * @return Resolves with itself
   */
  pin (pinned?: boolean) : Promise<TabInterface>

  /**
   * Unpins a tab.
   *
   * @return Resolves with itself
   */
  unpin () : Promise<TabInterface>

  /**
   * Sends a message to the tab.
   *
   * @param message Message with payload
   * @return Resolves with response data
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
