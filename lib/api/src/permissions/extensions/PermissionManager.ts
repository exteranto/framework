import { Permission } from '../Permission'
import { PermissionManager as AbstractPermissionManager } from '../PermissionManager'

export class PermissionManager extends AbstractPermissionManager {

  /**
   * @inheritdoc
   */
  public async contains (needle: Permission|Permission[]) : Promise<boolean> {
    if (!Array.isArray(needle)) {
      needle = [needle]
    }

    const { permissions }: any = await browser.permissions.getAll()

    return needle.every((permission) => {
      if (permission === undefined) {
        return false
      }

      return permissions.includes(permission)
    })
  }

}
