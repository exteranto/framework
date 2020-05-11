import { Event } from './Event'
import { Listener } from './Listener'
import { Middleware } from './Middleware'
import { HandlePipeline } from '@bausano/data-structures'

export class ListenerBag {

  /**
   * Events that are waiting to be read.
   */
  public mailbox: any[] = []

  /**
   * Listeners assigned to this instance.
   */
  private listeners: Listener[] = []

  /**
   * Middleware assigned to this instance.
   */
  private middleware: Middleware[] = []

  /**
   * Adds a listener to this listener bag instance.
   *
   * @param listener The listener to be added
   * @return This instance for chaining
   */
  public addListener (listener: Listener) : ListenerBag {
    this.listeners.push(listener)

    this.deliverMail()

    return this
  }

  /**
   * Adds a hook to this listener bag instance.
   *
   * @param handle The callback hook to be added
   * @return This instance for chaining
   */
  public addHook (handle: (payload: any) => void) : ListenerBag {
    this.addListener({ handle })

    return this
  }
  /**
   * Adds a middlware to this listener bag instance.
   *
   * @param middleware The middleware to be added
   * @return This instance for chaining
   */
  public addMiddleware (middleware: Middleware) : ListenerBag {
    this.middleware.push(middleware)

    return this
  }

  /**
   * Dispatch all listeners on this instance with provided event payload.
   * Trigger all middleware in the process.
   *
   * @param event The event to be passed to the listeners
   */
  public async dispatch (event: Event) : Promise<void> {
    return new HandlePipeline<Event>()
      .feed(event, this.middleware)
      .then(result => this.listeners.forEach(listener => listener.handle(result)))
  }

  /**
   * Checks if this listener bag instance has at least one listener assigned.
   *
   * @return Whether this instance has at least one listener
   */
  public hasListeners () : boolean {
    return this.listeners.length !== 0
  }

  /**
   * Checks if this listener bag instance has at least one of `name` assigned
   *
   * @param name The class name of the Listener to be queried
   * @return Whether this instance has at least one of listener `name`
   */
  public hasListener (name: string) : boolean {
    return this.listeners.some(listener => listener.constructor.name === name)
  }

  /**
   * Removes any listeners of `name` from the listener bag instance.
   *
   * @param name The class name of the Listener to be removed
   * @return This instance for chaining
   */
  public removeListener (name: string) : ListenerBag {
    this.listeners = this.listeners.filter(listener => {
      return listener.constructor.name !== name
    })

    return this
  }

  /**
   * Delivers all events in the mailbox.
   */
  private deliverMail () : void {
    this.mailbox.forEach(deliver => deliver())

    this.mailbox = []
  }

}
