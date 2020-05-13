import { Identity as AbstractIdentity } from '../Identity'
import { AuthFlowFailedException } from '@internal/identity/exceptions'

export class Identity extends AbstractIdentity {

  /**
   * {@inheritdoc}
   */
  public getRedirectUrl (path: string) : string {
    return `${browser.identity.getRedirectURL()}${path}`
  }

  /**
   * Performs first steps of OAuth2 flow, including authenticating user with the
   * service provider and handling client authorization.
   *
   * @param url The url required by service provider to grant access token
   * @param interactive If false, flow completes/fails silently - defaults true
   * @return The redirect url + credentials
   */
  public launchAuthFlow (url: string, interactive: boolean = true) : Promise<string> {
    return browser.identity.launchWebAuthFlow({ url, interactive })
      .catch(() => Promise.reject(new AuthFlowFailedException()))
  }

}
