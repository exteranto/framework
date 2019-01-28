import { Permission } from '../Permission'
import { PermissionManager as AbstractPermissionManager } from '../PermissionManager'

export class PermissionManager extends AbstractPermissionManager {
  /**
   * @inheritdoc
   */
  public async contains (_: Permission) : Promise<boolean> {
    return true
  }
}
