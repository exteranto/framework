import { Message } from './Message'
import { Script, Dispatcher, Autowired, Param } from '@exteranto/core'

export abstract class Messaging {

  /**
   * Event dispatcher implementation.
   */
  @Autowired
  private dispatcher: Dispatcher

  /**
   * The current script.
   */
  @Param('script')
  protected script: Script

  /**
   * Establish a listener server.
   */
  public abstract listen () : void

  /**
   * Sends a message across scripts.
   *
   * @param message Message event
   * @return Response body
   */
  public abstract async send (message: Message) : Promise<any>

  /**
   * Dispatches the received message via the dispatcher dependency.
   *
   * @param name Used to construct new event instance
   * @param payload Event payload that is sent to receiver
   * @param context Data such as tab id
   * @param respond Calling this function resolves the promise
   */
  protected dispatch (
    name: string,
    payload: any,
    context: any,
    respond: (response: any) => any,
  ) : void {
    // Get and instantiate the desired message event model.
    const Constructor: any = this.dispatcher.type(name)

    if (Constructor === undefined) {
      return
    }

    const event: Message = new Constructor(payload)

    // Assign important data to the model.
    event.context = context
    event.respond = respond

    // We use the dispatcher to dispatch a message event to the appropriate
    // listener.
    this.dispatcher.fire(event)
  }

}
