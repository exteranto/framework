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
    return browser.cookies.get({ url, name })
      .then((cookie: any) => {
        return cookie === null
          ? Promise.reject(new EmptyResponseException())
          : cookie
      })
      .catch(e => Promise.reject(new InvalidCookieRequestException(e)))
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
      dispatcher.fire('app.cookies.changed', cookie)
    })
  }
}
