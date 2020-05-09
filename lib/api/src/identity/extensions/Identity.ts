import { Identity as AbstractIdentity } from '../Identity'

export class Identity extends AbstractIdentity {

  /**
   * {@inheritdoc}
   */
  public getRedirectUrl (path: string) : string {
    return `${browser.identity.getRedirectURL()}${path}`
  }

  /**
   * {@inheritdoc}
   */
  public launchAuthFlow (url: string, interactive: boolean = true) : Promise<string> {
    return browser.identity.launchWebAuthFlow({ url, interactive })
      .catch(error => Promise.reject(error))
  }

}
