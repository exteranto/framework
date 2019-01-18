import { Permission } from './Permission'
import { PermissionNotGrantedException } from '@exteranto/exceptions'

export abstract class PermissionManager {
  /**
   * Reference to permissions enum.
   *
   * @var {any} Permission Enum with permissions.
   */
  public static Permission: any = Permission

  /**
   * Resolves with true if requested permission is granted.
   *
   * @return {Promise<boolean>}
   */
  public abstract contains (needle: string|string[]) : Promise<boolean>

  /**
   * If requested permission is not granted, returns rejected promise.
   *
   * @throws {PermissionNotGrantedException}
   * @return {Promise<void>}
   */
  public async assume (permission: string|string[]) : Promise<void> {
    if (!await this.contains(permission)) {
      throw new PermissionNotGrantedException(permission.toString())
    }
  }
}
