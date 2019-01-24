import { expect } from 'chai'

import { PermissionManager } from '@internal/permissions'
import { PermissionManager as ChromePermissionManager } from '@internal/permissions/extensions/PermissionManager'

export default ({ browser }) => {
  let manager: PermissionManager

  before(() => {
    manager = new ChromePermissionManager
  })

}
