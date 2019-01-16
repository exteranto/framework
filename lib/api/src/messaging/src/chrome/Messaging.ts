import { Message } from '../Message'
import { Messaging as AbstractMessaging } from '../Messaging'
import Port = chrome.runtime.Port

export class Messaging extends AbstractMessaging {
  /**
   * @inheritdoc
   */
  public listen () : void {
    chrome.runtime.onConnect.addListener((port) => {
      port.onMessage.addListener((request) => {
        const respond: (body: any) => any = (body) => {
          port.postMessage({
            body: { name: body.name, message: body.message },
            ok: !(body instanceof Error),
          })
        }

        this.dispatch(
          request.event,
          request.payload,
          { tabId: port.sender.tab.id },
          respond,
        )
      })
    })
  }

  /**
   * @inheritdoc
   */
  public send (message: Message) : Promise<any> {
    return new Promise((resolve, reject) => {
      const respond: (response: any) => any = response => response.ok ? resolve(response.body) : reject(response.body)

      const port: Port = chrome.runtime.connect()

      port.postMessage({
        event: message.constructor.name,
        request: message.payload,
      })

      // This is triggered upon receiving a response from the listener.
      port.onMessage.addListener(respond)
    })
  }
}