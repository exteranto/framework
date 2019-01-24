import { expect } from 'chai'

import { PermissionManager } from '@internal/permissions'
import { PermissionManager as ChromePermissionManager } from '@internal/permissions/safari/PermissionManager'

export default ({ safari }) => {
  let manager: PermissionManager

  before(() => {
    manager = new ChromePermissionManager
  })

}
