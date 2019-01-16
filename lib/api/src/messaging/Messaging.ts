import { Message } from './Message'
import { Script, Dispatcher,  Autowired, Param } from '@exteranto/core'

export abstract class Messaging {
  /**
   * Event dispatcher implementation.
   *
   * @var {Dispatcher}
   */
  @Autowired
  private dispatcher: Dispatcher

  /**
   * The current script.
   *
   * @var {Script}
   */
  @Param('script')
  protected script: Script

  /**
   * Establish a listener server.
   *
   * @return {void}
   */
  public abstract listen () : void

  /**
   * Sends a message across scripts.
   *
   * @param {Message} message
   * @return {Promise<any>}
   */
  public abstract send (message: Message) : Promise<any>

  /**
   * Dispatches the received message via the dispatcher dependency.
   *
   * @param {string} event
   * @param {any} payload
   * @param {any} context
   * @param {(response: any) => any} respond
   * @return {void}
   */
  protected dispatch (
    name: string,
    payload: any,
    context: any,
    respond: (response: any) => any,
  ) : void {
    // Get and instantiate the desired message event model.
    const Constructor: any = this.dispatcher.type(name)
    const event: Message = new Constructor(payload)

    // Assign important data to the model.
    event.context = context
    event.respond = respond

    // We use the dispatcher to dispatch a message event to the appropriate
    // listener.
    this.dispatcher.fire(event)
  }
}
