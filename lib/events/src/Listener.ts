import { Event } from './Event'

export interface Listener {
  /**
   * Handle the fired event.
   *
   * @param {Event} event
   */
  handle (event: Event) : void
}
