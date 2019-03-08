import { Event } from '@exteranto/core'

/**
 * Event fired upon clicking the browser action icon in the browser extensions
 * bar.
 */
export class BrowserActionClickedEvent extends Event {

  /**
   * {@inheritdoc}
   */
  constructor (public tabId: number) {
    super()
  }

}
