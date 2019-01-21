import { Singleton } from '@internal/ioc'
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
   * Map of event names to their respective types.
   *
   * @var {Map<string, new (..._: any[]) => Event>} types
   */
  private types: Map<string, new (..._: any[]) => Event> = new Map()

  /**
   * Return the type associated with the event name.
   *
   * @param {string} name
   * @return {new (..._: any[]) => Event}
   */
  public type (name: string) : new (..._: any[]) => Event {
    return this.types.get(name)
  }

  /**
   * Return the listener bag assigned to the specified event.
   *
   * @param {new (..._: any[]) => Event} event
   * @return {ListenerBag}
   */
  public touch (event: new (..._: any[]) => Event) : ListenerBag {
    // Add the types to the event map.
    this.types.set(event.name, event)

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

    this.touch(event.constructor as new (..._: any[]) => Event).mailbox
      .push(() => this.fire(event))
  }
}
