import { Runtime as AbstractRuntime } from '../Runtime'
import { InvalidUrlFormatException } from '@exteranto/exceptions'

export class Runtime extends AbstractRuntime {
  /**
   * @inheritdoc
   */
  public setUninstallLink (url: string) : Promise<void> {
    return browser.runtime.setUninstallURL(url)
      .catch(e => Promise.reject(new InvalidUrlFormatException(e)))
  }
}
