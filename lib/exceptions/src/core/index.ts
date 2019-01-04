
export class InvalidRouteException extends Error {
  /**
   * Exception name.
   *
   * @return {string}
   */
  get name () : string {
    return 'app.exceptions.core.invalidRoute'
  }
}
