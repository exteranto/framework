import { PermissionManager as AbstractPermissionManager } from '../PermissionManager'

export class PermissionManager extends AbstractPermissionManager {
  /**
   * @inheritdoc
   */
  public async contains (_: string) : Promise<boolean> {
    return true
  }
}
