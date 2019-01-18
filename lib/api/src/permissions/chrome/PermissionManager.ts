import { PermissionManager as AbstractPermissionManager } from '../PermissionManager'

export class PermissionManager extends AbstractPermissionManager {
  /**
   * @inheritdoc
   */
  public async contains (needle: string|string[]) : Promise<boolean> {
    if (!Array.isArray(needle)) {
      needle = [needle]
    }

    /**
     * @var {string[]} permissions
     */
    const { permissions }: any = await new Promise(
      resolve => chrome.permissions.getAll(resolve),
    )

    return needle.every((permission) => {
      if (permission === undefined) {
        return false
      }

      return permissions.includes(permission)
    })
  }
}
