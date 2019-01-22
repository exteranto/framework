
export abstract class Extension {

  /**
   * Converts a relative path within extension file tree to a URL.
   *
   * @param {string} path
   * @return {string}
   */
  // TODO: Make sure the url points to the same directory in all browsers.
  public abstract getUrl (path?: string) : string
}
