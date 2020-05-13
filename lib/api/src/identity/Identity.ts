
export abstract class Identity {

  /**
   * Generates a url to be used as authentication redirect url.
   *
   * @param path A pathname to append to the origin
   * @return Authentication redirect url
   */
  public abstract getRedirectUrl (path: string) : string

  /**
   * Performs first steps of OAuth2 flow, including authenticating user with the
   * service provider and handling client authorization.
   *
   * @param url The url required by service provider to grant access token
   * @param interactive If false, flow completes/fails silently
   * @return The redirect url + credentials
   */
  public abstract launchAuthFlow (url: string, interactive?: boolean) : Promise<string>

}
