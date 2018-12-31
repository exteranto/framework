import { Runtime as AbstractRuntime } from '../Runtime'
import { InvalidUrlFormatException } from '@exteranto/exceptions'

export class Runtime extends AbstractRuntime {
  /**
   * @inheritdoc
   */
  public setUninstallLink (url: string) : Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.runtime.setUninstallURL(url, () => {
        const error = chrome.runtime.lastError

        error !== undefined
          ? reject(new InvalidUrlFormatException(error.message))
          : resolve()
      })
    })
  }
}
