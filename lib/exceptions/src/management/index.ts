
export class PermissionNotGrantedException extends Error {
  /**
   * Exception name.
   *
   * @return {string}
   */
  get name () : string {
    return 'app.exceptions.management.permissionNotGranted'
  }
}
