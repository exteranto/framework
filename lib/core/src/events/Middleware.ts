import { Event } from './Event'

export interface Middleware {
  /**
   * Intercept the incoming event.
   *
   * @param {Event} event
   */
  handle (event: Event) : Promise<any>
}
