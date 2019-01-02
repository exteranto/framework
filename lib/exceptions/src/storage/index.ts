
export class InvalidCookieRequestException extends Error {

  /**
   * Exception name.
   *
   * @return {string}
   */
  get name () : string {
    return 'app.exceptions.cookies.invalidCookieRequest'
  }
}
