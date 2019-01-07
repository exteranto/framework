import { Script } from '@exteranto/support'
import { Messaging as AbstractMessaging } from '../Messaging'

declare var safari: any

export class Messaging extends AbstractMessaging {
  /**
   * The object that contains promises to be resolved upon receiving a response.
   *
   * @var {any}
   */
  private promises: any = {}

  /**
   * Establish a listener server.
   *
   * @return {void}
   */
  public listen () : void {
    safari.application.addEventListener('message', (event) => {
      // If the message is a response, resolve the stored promise and do not
      // dispatch any events.
      if (event.name === '_response_') {
        return this.promises[event.message.id](event.message.payload)
      }

      this.dispatch(event.message, (response) => {
        // Safari does not support ports, so we need to send a message back
        // specifying that it is a response in the name. The response object is
        // also carrying the event id, so we can find the promise to be
        // resolved
        event.target.page.dispatchMessage('_response_', {
          event: event.message.event,
          id: event.message.id,
          payload: {
            body: response,
            ok: !(response instanceof Error),
          },
        })
      })
    }, false)
  }

  /**
   * Sends a message to the specified script and event.
   *
   * @param {Script} script
   * @param {string} event
   * @param {object} payload
   * @return {Promise<any>}
   */
  public send (script: Script, event: string, payload?: object) : Promise<any> {
    return new Promise((resolve, reject) => {
      const respond: (response: any) => any = response => response.ok ? resolve(response.body) : reject(response.body)

      if (script === this.script) {
        return this.dispatch({ script, event, payload }, respond)
      }

      const id: string = this.getUniqueId()

      this.promises[id] = respond
      this.sendToRuntime({ script, id, event, payload })
    })
  }

  /**
   * Sends a message to the application runtime (background/popup).
   *
   * @param {any} request
   * @return {void}
   */
  private sendToRuntime (request: object) : void {
    safari.self.tab.dispatchMessage('_', request)
  }

  /**
   * Returns an id that has not been used yet.
   *
   * @return {string}
   */
  private getUniqueId () : string {
    const id: string = Math.random().toString(16)

    return this.promises[id] === undefined ? id : this.getUniqueId()
  }
}
