import { Event } from './Event'

export interface Middleware {
  /**
   * Intercept the incoming event.
   *
   * @param event The event to be intercepted
   */
  handle (event: Event) : Promise<any>
}
