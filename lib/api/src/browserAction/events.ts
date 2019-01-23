import { Event } from '@exteranto/core'

export class BrowserActionClickedEvent extends Event {
  /**
   * @inheritdoc
   */
  constructor (private tabId: number) {
    super()
  }

  /**
   * Id of the tab that the badge was clicked on.
   *
   * @return {number}
   */
  public getTabId () : number {
    return this.tabId
  }
}
