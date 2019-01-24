import { expect } from 'chai'

import { PermissionManager } from '@internal/permissions'
import { PermissionManager as ChromePermissionManager } from '@internal/permissions/chrome/PermissionManager'

export default ({ chrome }) => {
  let manager: PermissionManager

  before(() => {
    manager = new ChromePermissionManager
  })

}
