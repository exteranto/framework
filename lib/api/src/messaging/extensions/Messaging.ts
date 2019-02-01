import { Message } from '../Message'
import { Messaging as AbstractMessaging } from '../Messaging'
import Port = browser.runtime.Port

export class Messaging extends AbstractMessaging {

  /**
   * @inheritdoc
   */
  public listen () : void {
    browser.runtime.onConnect.addListener((port) => {
      port.onMessage.addListener((request) => {
        const respond: (body: any) => any = (body) => {
          port.postMessage({
            body: (body instanceof Error) ? { name: body.name, message: body.message } : body,
            ok: !(body instanceof Error),
          })
        }

        this.dispatch(
          (request as any).event,
          (request as any).payload,
          port.sender.tab ? { tabId: port.sender.tab.id } : {},
          respond,
        )
      })
    })
  }

  /**
   * @inheritdoc
   */
  public async send (message: Message) : Promise<any> {
    return new Promise((resolve, reject) => {
      const respond: (response: any) => any = response => response.ok ? resolve(response.body) : reject(response.body)

      const port: Port = browser.runtime.connect()

      port.postMessage({
        event: message.constructor.name,
        payload: message.payload,
      })

      // This is triggered upon receiving a response from the listener.
      port.onMessage.addListener(respond)
    })
  }

}
