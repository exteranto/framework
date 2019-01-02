import { Listener } from './Listener'

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
   * Adds a listener to this instance.
   *
   * @param {Listener} listener
   */
  public addListener (listener: Listener) : void {
    this.listeners.push(listener)

    this.deliverMail()
  }

  /**
   * Adds a hook to this instance.
   *
   * @param {(payload: any) => void} handle
   */
  public addHook (handle: (payload: any) => void) : void {
    this.addListener({ handle })
  }

  /**
   * Dispatch all listeners on this instance with provided payload.
   *
   * @param {any} payload
   */
  public dispatch (payload: any) : void {
    this.listeners.forEach(listener => listener.handle(payload))
  }

  /**
   * Delivers all events in the mailbox.
   *
   * @return {void}
   */
  private deliverMail () : void {
    this.mailbox.forEach(payload => this.dispatch(payload))

    this.mailbox = []
  }
}
