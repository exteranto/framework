import { Script } from '@exteranto/support'
import { Messaging as AbstractMessaging } from '../Messaging'
import Port = chrome.runtime.Port

export class Messaging extends AbstractMessaging {
  /**
   * Establish a listener server.
   *
   * @return {void}
   */
  public listen () : void {
    chrome.runtime.onConnect.addListener((port) => {
      port.onMessage.addListener((request) => {
        this.dispatch(request, response => port.postMessage(response))
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
    return new Promise((resolve) => {
      script === this.script
        ? this.dispatch({ script, event, payload }, resolve)
        : this.sendToRuntime({ script, event, payload }, resolve)
    })
  }

  /**
   * Sends a message to the application runtime (background/popup).
   *
   * @param {any} request
   * @param {() => any} resolve
   * @return {void}
   */
  private sendToRuntime (request: object, resolve: () => any) : void {
    const port: Port = chrome.runtime.connect()

    port.postMessage(request)

    // This is triggered upon receiving a response from the listener.
    port.onMessage.addListener(resolve)
  }
}
