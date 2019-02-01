import { PermissionManager as AbstractPermissionManager } from '../PermissionManager'

export class PermissionManager extends AbstractPermissionManager {

  /**
   * @inheritdoc
   */
  public async contains () : Promise<boolean> {
    return true
  }

}
