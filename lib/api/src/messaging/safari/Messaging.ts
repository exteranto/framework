import { Message } from '../Message'
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
   * @inheritdoc
   */
  public listen () : void {
    safari.application.addEventListener('message', (event) => {
      // If the message is a response, resolve the stored promise and do not
      // dispatch any events.
      if (event.name === '_response_') {
        return this.promises[event.message.id](event.message.payload)
      }

      const respond: (response: any) => any = (response) => {
        // Safari does not support ports, so we need to send a message back
        // specifying that it is a response in the name. The response object is
        // also carrying the event id, so we can find the promise to be
        // resolved
        event.target.page.dispatchMessage('_response_', {
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
   * @inheritdoc
   */
  public send (message: Message) : Promise<any> {
    return new Promise((resolve, reject) => {
      const respond: (response: any) => any = response => response.ok ? resolve(response.body) : reject(response.body)

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
   * @return {string}
   */
  private getUniqueId () : string {
    const id: string = Math.random().toString(16)

    return this.promises[id] === undefined ? id : this.getUniqueId()
  }
}
