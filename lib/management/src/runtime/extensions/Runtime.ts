import { register } from './events'
import { Dispatcher } from '@exteranto/events'
import { Runtime as AbstractRuntime } from '../Runtime'
import { InvalidUrlFormatException } from '@exteranto/exceptions'

export class Runtime extends AbstractRuntime {
  /**
   * @inheritdoc
   */
  public setUninstallUrl (url: string) : Promise<void> {
    return browser.runtime.setUninstallURL(url)
      .catch(e => Promise.reject(new InvalidUrlFormatException(e)))
  }

  /**
   * @inheritdoc
   */
  public extensionUrl (path: string = '') : string {
    return browser.runtime.getURL(path)
  }

  /**
   * @inheritdoc
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    register(dispatcher)
  }
}
