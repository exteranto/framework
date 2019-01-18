import { assert } from 'chai'
import * as browser from 'sinon-chrome/extensions'

import { Container } from '@exteranto/core'
import { Browser } from '@exteranto/core'

import { Permission, PermissionManager } from '../../../src'

const { ACTIVE_TAB, STORAGE, BOOKMARKS } = Permission

export const tests = () => {
  describe('Extensions', () => {
    let manager: PermissionManager

    before(() => {
      Container.bindParam('browser', Browser.EXTENSIONS)

      manager = Container.resolve(PermissionManager)
    })

    beforeEach(() => {
      browser.permissions.getAll.resolves({
        permissions: [ ACTIVE_TAB, STORAGE ]
      })
    })

    it('Contains method takes a single string.', async () => {
      assert.isOk(await manager.contains(ACTIVE_TAB))
    })

    it('Contains method takes an array of strings.', async () => {
      assert.isOk(await manager.contains([ ACTIVE_TAB, STORAGE ]))
    })

    it('Contains returns false if permission is not included.', async () => {
      assert.isNotOk(await manager.contains(BOOKMARKS))
    })

    it('Contains returns false if permission is undefined.', async () => {
      assert.isNotOk(await manager.contains(undefined))
    })
  })
}
