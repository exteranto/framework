import { Listener } from './Listener'
import { Middleware } from './Middleware'
import { Pipeline } from '@exteranto/support'

export class ListenerBag {
  /**
   * Events that are waiting to be read.
   *
   * @var {any[]} mailbox
   */
  public mailbox: any[] = []

  /**
   * Listeners assigned to this instance.
   *
   * @type {Listener[]}
   */
  private listeners: Listener[] = []

  /**
   * Middleware assigned to this instance.
   *
   * @type {Middleware[]}
   */
  private middleware: Middleware[] = []

  /**
   * Adds a listener to this instance.
   *
   * @param {Listener} listener
   * @return {ListenerBag}
   */
  public addListener (listener: Listener) : ListenerBag {
    this.listeners.push(listener)

    this.deliverMail()

    return this
  }

  /**
   * Adds a hook to this instance.
   *
   * @param {(payload: any) => void} handle
   * @return {ListenerBag}
   */
  public addHook (handle: (payload: any) => void) : ListenerBag {
    this.addListener({ handle })

    return this
  }
  /**
   * Adds a middlware to this instance.
   *
   * @param {Middleware} middleware
   * @return {ListenerBag}
   */
  public addMiddleware (middleware: Middleware) : ListenerBag {
    this.middleware.push(middleware)

    return this
  }

  /**
   * Dispatch all listeners on this instance with provided payload. Trigger
   * all middleware in the process.
   *
   * @param {any} payload
   * @param {Promise<void>}
   */
  public async dispatch (payload: any) : Promise<void> {
    return new Pipeline()
      .send(payload)
      .via('handle')
      .through(this.middleware)
      .then(result => this.listeners.forEach(listener => listener.handle(result)))
  }

  /**
   * Checks if event has a listener assigned.
   *
   * @return {boolean}
   */
  public hasListeners () : boolean {
    return this.listeners.length !== 0
  }

  /**
   * Delivers all events in the mailbox.
   *
   * @return {void}
   */
  private deliverMail () : void {
    this.mailbox.forEach(deliver => deliver())

    this.mailbox = []
  }
}
