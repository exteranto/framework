import { CookieChangedEvent } from '../events'
import { Cookies as AbstractCookies } from '../Cookies'
import { EmptyResponseException } from '@internal/exceptions'
import { Dispatcher, RegistersNativeEvents } from '@exteranto/core'
import { InvalidCookieRequestException } from '@internal/cookies/exceptions'

export class Cookies extends AbstractCookies implements RegistersNativeEvents {

  /**
   * {@inheritdoc}
   */
  public async get (url: string, name: string) : Promise<any> {
    return browser.cookies.get({ url, name })
      .catch(e => Promise.reject(new InvalidCookieRequestException(e)))
      .then((cookie: any) => {
        return cookie === null
          ? Promise.reject(new EmptyResponseException())
          : cookie
      })
  }

  /**
   * {@inheritdoc}
   */
  public async getAll (params?: any) : Promise<any[]> {
    return browser.cookies.getAll(params)
      .catch(e => Promise.reject(new InvalidCookieRequestException(e)))
  }

  /**
   * {@inheritdoc}
   */
  public async set (params?: any) : Promise<void> {
    return browser.cookies.set(params)
      .then(() => undefined)
      .catch(e => Promise.reject(new InvalidCookieRequestException(e)))
  }

  /**
   * {@inheritdoc}
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    browser.cookies.onChanged.addListener((cookie) => {
      dispatcher.fire(new CookieChangedEvent(cookie))
    })
  }

}
