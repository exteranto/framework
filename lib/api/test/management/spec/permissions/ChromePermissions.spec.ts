import { assert } from 'chai'
import * as chrome from 'sinon-chrome'

import { Container } from '@exteranto/core'
import { Browser } from '@exteranto/core'

import { Permission, PermissionManager } from '../../../src'

const { ACTIVE_TAB, STORAGE, BOOKMARKS } = Permission

export const tests = () => {
  describe('Chrome', () => {
    let manager: PermissionManager

    before(() => {
      Container.bindParam('browser', Browser.CHROME)

      manager = Container.resolve(PermissionManager)
    })

    beforeEach(() => {
      chrome.permissions.getAll.yields({
        permissions: [ACTIVE_TAB, STORAGE]
      })
    })

    it('Contains method takes a single string.', async () => {
      assert.isOk(await manager.contains(ACTIVE_TAB))
    })

    it('Contains method takes an array of strings.', async () => {
      assert.isOk(await manager.contains([ACTIVE_TAB, STORAGE]))
    })

    it('Contains returns false if permission is not included.', async () => {
      assert.isNotOk(await manager.contains(BOOKMARKS))
    })

    it('Contains returns false if permission is undefined.', async () => {
      assert.isNotOk(await manager.contains(undefined))
    })
  })
}
