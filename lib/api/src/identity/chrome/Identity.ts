import { Identity as AbstractIdentity } from '../Identity'

export class Identity extends AbstractIdentity {

  /**
   * {@inheritdoc}
   */
  public getRedirectUrl (path: string) : string {
    return chrome.identity.getRedirectURL(path)
  }

  /**
   * {@inheritdoc}
   */
  public launchAuthFlow (url: string, interactive: boolean = true) : Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.identity.launchWebAuthFlow({ url, interactive }, response => chrome.runtime.lastError
        ? reject(chrome.runtime.lastError)
        : resolve(response))
    })
  }

}
