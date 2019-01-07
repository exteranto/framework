import { Script } from '@exteranto/support'
import { Messaging as AbstractMessaging } from '../Messaging'
import Port = browser.runtime.Port

export class Messaging extends AbstractMessaging {
  /**
   * Establish a listener server in the current script.
   *
   * @return {void}
   */
  public listen () : void {
    browser.runtime.onConnect.addListener((port) => {
      port.onMessage.addListener((request) => {
        const respond: (body: any) => any = body => port.postMessage({ ok: !(body instanceof Error), body })

        this.dispatch(request, respond)
      })
    })
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

      script === this.script
        ? this.dispatch({ script, event, payload }, respond)
        : this.sendToRuntime({ script, event, payload }, respond)
    })
  }

  /**
   * Sends a message to the application runtime (background/popup).
   *
   * @param {any} request
   * @param {(response: any) => any} resolve
   * @return {void}
   */
  private sendToRuntime (request: object, resolve: (response: any) => any) : void {
    const port: Port = browser.runtime.connect()

    port.postMessage(request)

    // This is triggered upon receiving a response from the listener.
    port.onMessage.addListener(resolve)
  }
}
