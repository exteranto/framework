import { Listener } from './Listener'

export class ListenerBag {
  /**
   * Listeners assigned to this instance.
   *
   * @type {Listener[]}
   */
  private listeners: Listener[] = []

  /**
   * Hooks assigned to this instance.
   *
   * @var {Array<(payload: any) => void>}
   */
  private hooks: Array<(payload: any) => void> = []

  /**
   * Adds a listener to this instance.
   *
   * @param {Listener} listener
   */
  public addListener (listener: Listener) : void {
    this.listeners.push(listener)
  }

  /**
   * Adds a hook to this instance.
   *
   * @param {(payload: any) => void} hook
   */
  public addHook (hook: (payload: any) => void) : void {
    this.hooks.push(hook)
  }

  /**
   * Dispatch all listeners on this instance with provided payload.
   *
   * @param {any} payload
   */
  public dispatch (payload: any) : void {
    this.listeners.forEach(listener => listener.handle(payload))

    this.hooks.forEach(hook => hook(payload))
  }
}
