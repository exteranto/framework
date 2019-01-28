import { expect } from 'chai'

import { PermissionManager, Permission } from '@internal/permissions'
import { PermissionManager as SafariPermissionManager } from '@internal/permissions/safari/PermissionManager'

export default () => {
  let manager: PermissionManager

  beforeEach(() => {
    manager = new SafariPermissionManager
  })

  it('always returns true', async () => {
    await expect(manager.contains(Permission.STORAGE))
      .to.eventually.be.true
    await expect(manager.contains(undefined))
      .to.eventually.be.true
  })
}
