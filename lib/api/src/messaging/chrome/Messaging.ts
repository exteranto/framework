import { Message } from '../Message'
import { ConnectionRefusedException } from '../exceptions'
import { Messaging as AbstractMessaging } from '../Messaging'

import Port = chrome.runtime.Port

export class Messaging extends AbstractMessaging {

  /**
   * {@inheritdoc}
   */
  public listen () : void {
    chrome.runtime.onConnect.addListener((port) => {
      port.onMessage.addListener((request) => {
        const respond: (body: any) => void = (body) => {
          port.postMessage({
            body: (body instanceof Error) ? { name: body.name, message: body.message } : body,
            ok: !(body instanceof Error),
          })
        }

        this.dispatch(
          request.event,
          request.payload,
          port.sender.tab ? { tabId: port.sender.tab.id } : {},
          respond,
        )
      })
    })
  }

  /**
   * {@inheritdoc}
   */
  public async send (message: Message) : Promise<any> {
    return new Promise((resolve, reject) => {
      const respond: (response: any) => void = response => response.ok ? resolve(response.body) : reject(response.body)

      const port: Port = chrome.runtime.connect()

      port.postMessage({
        event: message.constructor.name,
        payload: message.payload,
      })

      // Settle the promise upon receiving a response from ther receiver or
      // reject it if the connection could not be established.
      port.onMessage.addListener(respond)
      port.onDisconnect.addListener(() => chrome.runtime.lastError && reject(new ConnectionRefusedException()))
    })
  }

}
