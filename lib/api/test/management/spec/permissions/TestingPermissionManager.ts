import { PermissionManager as AbstractPermissionManager, HasAccessTo } from '../../../../src'

export class TestingPermissionManager extends AbstractPermissionManager {
  public expectedResult: boolean = true

  /**
   * @inheritdoc
   */
  public async contains (_: string|string[]) : Promise<boolean> {
    return this.expectedResult
  }

  /**
   * Testing method.
   *
   * @param {string} string
   */
  @HasAccessTo(AbstractPermissionManager.Permission.BOOKMARKS)
  public test (string: string) : string {
    return string + string
  }
}
