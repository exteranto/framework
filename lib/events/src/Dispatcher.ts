import { Singleton } from '@exteranto/ioc'
import { Exception } from '@exteranto/exceptions'
import { Event } from './Event'
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
   * @param {typeof Event} event
   * @return {ListenerBag}
   */
  public touch (event: typeof Event) : ListenerBag {
    return this.events[event.name] === undefined
      ? this.events[event.name] = new ListenerBag()
      : this.events[event.name]
  }

  /**
   * Fires the event. Catches any exceptions and passes them to the exception
   * handling event listeners.
   *
   * @param {Event} event
   */
  public fire (event: Event) : void {
    if (this.events[event.constructor.name] === undefined) {
      return
    }

    this.events[event.constructor.name].dispatch(event)
      .catch((e) => {
        if (e.constructor && this.events[e.constructor.name]) {
          return this.events[e.constructor.name].dispatch(e)
        }

        if (this.events[Exception.name]) {
          return this.events[Exception.name].dispatch(e)
        }

        throw e
      })
  }

  /**
   * Puts an event into a mailbox for future listeners to read it.
   *
   * @param {Event} event
   */
  public mail (event: Event) : void {
    const bag: ListenerBag = this.events[event.constructor.name]

    if (bag !== undefined && bag.hasListeners()) {
      return this.fire(event)
    }

    this.touch(event.constructor as typeof Event).mailbox
      .push(() => this.fire(event))
  }
}
