import { Event } from './Event'
import { ListenerBag } from './ListenerBag'
import { Exception } from '@internal/Exception'
import { Singleton, Class } from '@internal/ioc'

@Singleton
export class Dispatcher {

  /**
   * All application events are stored in this object as a key-value pair.
   */
  private events: object = {}

  /**
   * Map of event names to their respective types.
   */
  private types: Map<string, Class<Event>> = new Map()

  /**
   * Return the type associated with the event name.
   *
   * @param name The name to look for
   * @return The event type constructor if found or null
   */
  public type (name: string) : Class<Event> {
    return this.types.get(name)
  }

  /**
   * Return the listener bag assigned to the specified event.
   *
   * @param event The event type constructor to modify
   * @return The corresponding listener bag
   */
  public touch (event: Class<Event>) : ListenerBag {
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
   * @param event The event to be fired
   */
  public fire (event: Event) : void {
    // Search suitable events in the inheritance tree.
    Array.from(this.types.values())
      .filter(type => type.name === event.constructor.name || type.isPrototypeOf(event.constructor))
      .filter(type => this.events[type.name] !== undefined)
      .forEach(type => this.triggerListenerBag(type.name, event))
  }

  /**
   * Puts an event into a mailbox for future listeners to read it.
   *
   * @param event The event to be mailed
   */
  public mail (event: Event) : void {
    const bag: ListenerBag = this.events[event.constructor.name]

    if (bag !== undefined && bag.hasListeners()) {
      return this.fire(event)
    }

    this.touch(event.constructor as Class<Event>).mailbox
      .push(() => this.fire(event))
  }

  /**
   * Triggers the specified listener bag.
   *
   * @param name The name of the event to be fired
   * @param event The event instance to be passed to the listeners
   */
  private triggerListenerBag (name: string, event: Event) : void {
    this.events[name].dispatch(event)
      .catch((e: Error) => {
        if (e.constructor && this.events[e.constructor.name]) {
          return this.events[e.constructor.name].dispatch(e)
        }

        if (this.events[Exception.name]) {
          return this.events[Exception.name].dispatch(e)
        }

        throw e
      })
  }

}
