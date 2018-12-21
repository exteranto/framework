import { Dispatcher } from '@exteranto/events'
import { Autowired, Param } from '@exteranto/ioc'
import { Script } from '@exteranto/support'

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
   * Sends a message to the specified script and event.
   *
   * @param {Script} script
   * @param {string} event
   * @param {object} payload
   * @return {Promise<any>}
   */
  public abstract send (script: Script, event: string, payload?: object) : Promise<any>

  /**
   * Dispatches an event to all suitable events.
   *
   * @param {object} request
   * @param {(response: any) => any} respond
   * @return {void}
   */
  protected dispatch (request: any, respond: (response: any) => any) : void {
    // If the message was not meant for this script, cancel the execution.
    if (request.script !== this.script) {
      return
    }

    // We use the dispatcher to dispatch a message event to the appropriate
    // listener.
    this.dispatcher.fire(request.event, {
      request: request.payload,
      respond,
    })
  }
}
