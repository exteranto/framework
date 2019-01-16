import { assert } from 'chai'

import { Container } from '@exteranto/core'
import { Browser } from '@exteranto/core'

import { Permission, PermissionManager } from '../../../../src'

export const tests = () => {
  describe('Safari', () => {
    let manager: PermissionManager

    before(() => {
      Container.bindParam('browser', Browser.SAFARI)

      manager = Container.resolve(PermissionManager)
    })

    it('Always returns true.', async () => {
      assert.isOk(await manager.contains('activeTab'))

      assert.isOk(await manager.contains(Permission.STORAGE))

      assert.isOk(await manager.contains(undefined))
    })
  })
}
