import { Event } from './Event'

export interface Listener {

  /**
   * Handle the fired event.
   *
   * @param event The event instance to be handled
   */
  handle (event: Event) : void
}
