
export class VersionNotMatchedException extends Error {
  /**
   * Exception name.
   *
   * @return {string}
   */
  get name () : string {
    return 'app.exceptions.compatibility.versionNotMatched'
  }
}
