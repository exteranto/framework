import { Event } from '@exteranto/core'

export class BrowserActionClickedEvent extends Event {
  /**
   * @inheritdoc
   */
  constructor (public tabId: number) {
    super()
  }
}
