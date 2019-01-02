import { Singleton } from '@exteranto/ioc'
import { ListenerBag } from './ListenerBag'

@Singleton
export class Dispatcher {
  /**
   * All application events are stored here.
   *
   * @var {object} events
   */
  private events: object = {}

  /**
   * Return the listener bag assigned to the specified event.
   *
   * @param {string} event
   * @return {ListenerBag}
   */
  public touch (event: string) : ListenerBag {
    return this.events[event] === undefined
      ? this.events[event] = new ListenerBag()
      : this.events[event]
  }

  /**
   * Fires the event. Catches any exceptions and passes them to the exception
   * handling event listeners.
   *
   * @param {string} event
   * @param {any} payload
   */
  public fire (event: string, payload: any = null) : void {
    if (this.events[event] === undefined) {
      return
    }

    try {
      this.events[event].dispatch(payload)
    } catch (e) {
      if (e.name && this.events[`app.exception.${e.name}`]) {
        return this.events[`app.exception.${e.name}`].dispatch(e)
      }

      if (this.events['app.exception']) {
        return this.events['app.exception'].dispatch(e)
      }

      throw e
    }
  }

  /**
   * Puts an event into a mailbox for future listeners to read it.
   *
   * @param {string} event
   * @param {any} payload
   */
  public mail (event: string, payload: any = null) : void {
    if (this.events[event] !== undefined) {
      return this.fire(event, payload)
    }

    this.touch(event).mailbox.push(payload)
  }
}
