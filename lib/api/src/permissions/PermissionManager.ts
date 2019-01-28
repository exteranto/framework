import { Permission } from './Permission'
import { PermissionNotGrantedException } from '@exteranto/exceptions'

export abstract class PermissionManager {
  /**
   * Reference to permissions enum.
   */
  public static Permission: typeof Permission = Permission

  /**
   * Resolves with true if requested permission is granted.
   *
   * @param needle Single or array of permissions
   * @return Whether the extension has a permission
   */
  public abstract contains (needle: Permission|Permission[]) : Promise<boolean>

  /**
   * If requested permission is not granted, returns rejected promise.
   *
   * @throws {PermissionNotGrantedException}
   */
  public async assume (permission: Permission|Permission[]) : Promise<void> {
    if (!await this.contains(permission)) {
      throw new PermissionNotGrantedException(permission.toString())
    }
  }
}
