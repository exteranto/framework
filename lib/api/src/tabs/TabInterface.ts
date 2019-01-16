import { Message } from '@internal/messaging'

export interface TabInterface {

  /**
   * Retrieves the tab id.
   *
   * @return {number}
   */
  id () : number

  /**
   * Retrieves the tab url.
   *
   * @return {Promise<string>}
   */
  url () : Promise<string>

  /**
   * Closes the tab.
   *
   * @return {Promise<void>}
   */
  close () : Promise<void>

  /**
   * Reloads the tab.
   *
   * @return {Promise<Tab>}
   */
  reload () : Promise<TabInterface>

  /**
   * Duplicates the tab.
   *
   * @return {Promise<Tab>}
   */
  duplicate () : Promise<TabInterface>

  /**
   * Marks tab as active.
   *
   * @return {Promise<Tab>}
   */
  activate () : Promise<TabInterface>

  /**
   * Sends a message to the tab.
   *
   * @param {Message} message
   * @return {Promise<any>}
   */
  send (message: Message) : Promise<any>

  /**
   * Resolves a value from the original cached tab object. Note that values on
   * this object might not be cross-browser compatible.
   *
   * @param {string} key
   * @return {any}
   */
  raw (key: string) : any
}
