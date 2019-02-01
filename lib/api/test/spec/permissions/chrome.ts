import { expect } from 'chai'

import { PermissionManager, Permission } from '@internal/permissions'
import { PermissionManager as ChromePermissionManager } from '@internal/permissions/chrome/PermissionManager'

export default ({ chrome }) => {
  let manager: PermissionManager

  beforeEach(() => {
    manager = new ChromePermissionManager

    chrome.permissions.getAll.yields({
      permissions: [Permission.ACTIVE_TAB, Permission.STORAGE]
    })
  })

  it('contains method takes a single string', async () => {
    return expect(manager.contains(Permission.ACTIVE_TAB))
      .to.eventually.be.true
  })

  it('contains method takes an array of strings', async () => {
    return expect(manager.contains([Permission.ACTIVE_TAB, Permission.STORAGE]))
      .to.eventually.be.true
  })

  it('contains returns false if permission is not included', async () => {
    return expect(manager.contains(Permission.BOOKMARKS))
      .to.eventually.be.false
  })

  it('contains returns false if permission is undefined', async () => {
    return expect(manager.contains(undefined))
      .to.eventually.be.false
  })
}
