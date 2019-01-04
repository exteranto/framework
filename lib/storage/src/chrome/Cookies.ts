import { Cookies as AbstractCookies } from '../Cookies'
import { Dispatcher, RegistersNativeEvents } from '@exteranto/events'
import {
  EmptyResponseException,
  InvalidCookieRequestException,
} from '@exteranto/exceptions'

export class Cookies extends AbstractCookies implements RegistersNativeEvents {

  /**
   * @inheritdoc
   */
  public get (url: string, name: string) : Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.cookies.get({ url, name }, (cookie) => {
        const error: any = chrome.runtime.lastError

        if (error) {
          return reject(new InvalidCookieRequestException(error.message))
        }

        cookie === null
          ? reject(new EmptyResponseException())
          : resolve(cookie)
      })
    })
  }

  /**
   * @inheritdoc
   */
  public getAll (params?: any) : Promise<any[]> {
    return new Promise((resolve, reject) => {
      chrome.cookies.getAll(params, (cookies) => {
        const error: any = chrome.runtime.lastError

        !error
          ? resolve(cookies)
          : reject(new InvalidCookieRequestException(error.message))
      })
    })
  }

  /**
   * @inheritdoc
   */
  public set (params?: any) : Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.cookies.set(params, () => {
        const error: any = chrome.runtime.lastError

        !error
          ? resolve()
          : reject(new InvalidCookieRequestException(error.message))
      })
    })
  }

  /**
   * Register all native events on the given module.
   *
   * @param {Dispatcher} dispatcher
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    chrome.cookies.onChanged.addListener((cookie) => {
      dispatcher.fire('app.cookies.changed', cookie)
    })
  }
}
