import { CookieChangedEvent } from '../events'
import { Cookies as AbstractCookies } from '../Cookies'
import { Dispatcher, RegistersNativeEvents } from '@exteranto/core'
import {
  EmptyResponseException,
  InvalidCookieRequestException,
} from '@exteranto/exceptions'

export class Cookies extends AbstractCookies implements RegistersNativeEvents {

  /**
   * @inheritdoc
   */
  public get (url: string, name: string) : Promise<any> {
    return browser.cookies.get({ url, name })
      .catch(e => Promise.reject(new InvalidCookieRequestException(e)))
      .then((cookie: any) => {
        return cookie === null
          ? Promise.reject(new EmptyResponseException())
          : cookie
      })
  }

  /**
   * @inheritdoc
   */
  public getAll (params?: any) : Promise<any[]> {
    return browser.cookies.getAll(params)
      .catch(e => Promise.reject(new InvalidCookieRequestException(e)))
  }

  /**
   * @inheritdoc
   */
  public set (params?: any) : Promise<void> {
    return browser.cookies.set(params)
      .then(() => undefined)
      .catch(e => Promise.reject(new InvalidCookieRequestException(e)))
  }

  /**
   * Register all native events on the given module.
   *
   * @param {Dispatcher} dispatcher
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    browser.cookies.onChanged.addListener((cookie) => {
      dispatcher.fire(new CookieChangedEvent(cookie))
    })
  }
}
