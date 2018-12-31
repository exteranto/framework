
export class TabIdUnknownException extends Error {
  /**
   * Exception name.
   *
   * @return {string}
   */
  get name () : string {
    return 'app.exceptions.tabs.tabIdUnknown'
  }
}
