import { Message } from '../Message'
import { Param, Script } from '@exteranto/core'
import { Messaging as AbstractMessaging } from '../Messaging'

declare var safari: any

export class Messaging extends AbstractMessaging {

  /**
   * The object that contains promises to be resolved upon receiving a response.
   */
  private promises: any = {}

  /**
   * The current script.
   */
  @Param('script')
  protected script: Script

  /**
   * {@inheritdoc}
   */
  public listen () : void {
    safari[
      this.script === Script.BACKGROUND ? 'application' : 'self'
    ].addEventListener('message', (event) => {
      // If the message is a response, resolve the stored promise and do not
      // dispatch any events.
      if (event.name === '_response_') {
        if (this.promises[event.message.id]) {
          this.promises[event.message.id](event.message.payload)
        }

        // Remove the promise.
        delete this.promises[event.message.id]

        return
      }

      const respond: (response: any) => void = (response) => {
        // Safari does not support ports, so we need to send a message back
        // specifying that it is a response in the name. The response object is
        // also carrying the event id, so we can find the promise to be
        // resolved
        event.target[
          this.script === Script.BACKGROUND ? 'page' : 'tab'
        ].dispatchMessage('_response_', {
          event: event.message.event,
          id: event.message.id,
          payload: {
            body: (response instanceof Error) ? { name: response.name, message: response.message } : response,
            ok: !(response instanceof Error),
          },
        })
      }

      this.dispatch(
        event.message.event,
        event.message.payload,
        event.target.eid ? { tabId: event.target.eid } : {},
        respond,
      )
    }, false)
  }

  /**
   * {@inheritdoc}
   */
  public async send (message: Message) : Promise<any> {
    return new Promise((resolve, reject) => {
      const respond: (response: any) => void = response => response.ok ? resolve(response.body) : reject(response.body)

      const id: string = this.getUniqueId()

      this.promises[id] = respond

      safari.self.tab.dispatchMessage('_', {
        event: message.constructor.name,
        id,
        payload: message.payload,
      })
    })
  }

  /**
   * Returns an id that has not been used yet.
   *
   * @return Unique promise id
   */
  private getUniqueId () : string {
    const id: string = Math.random().toString(16)

    return this.promises[id] === undefined ? id : this.getUniqueId()
  }

}
