
export abstract class Identity {

  /**
   * Doc...
   *
   * @param path
   * @return
   */
  public abstract getRedirectUrl (path: string) : string

  /**
   * Doc...
   *
   * @param url
   * @param interactive
   */
  public abstract launchAuthFlow (url: string, interactive?: boolean) : Promise<string>

}
