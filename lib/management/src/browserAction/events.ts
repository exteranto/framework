import { Event } from '@exteranto/events'

export class BrowserActionClickedEvent extends Event {
  /**
   * @inheritdoc
   */
  constructor (private data?: any) {
    super()
  }

  /**
   * Id of the tab that the badge was clicked on.
   *
   * @return {number}
   */
  public tabId () : number {
    return this.data.id
  }
}
