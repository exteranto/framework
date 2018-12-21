import { assert } from 'chai'

import { extensionsTests } from './ExtensionsPermissions.spec'
import { safariTests } from './SafariPermissions.spec'
import { chromeTests } from './ChromePermissions.spec'

import { Container } from '@exteranto/ioc'
import { Browser } from '@exteranto/support'

import { Permission, PermissionManager } from '../../../src'
import { TestingPermissionManager } from './TestingPermissionManager'

import { PermissionNotGrantedException } from '@exteranto/exceptions'

const { STORAGE, BOOKMARKS } = Permission

describe('Permissions', () => {
  let manager

  before(() => {
    Container.bind(TestingPermissionManager)
      .to(PermissionManager).for(Browser.TESTING).singleton(true)

    Container.bindParam('browser', Browser.TESTING)

    manager = Container.resolve(PermissionManager)
  })

  it('Enum const resolves to string.', () => {
    assert.equal(STORAGE, 'storage')
  })

  it('Assume method returns void if permission is included.', () => {
    return assert.isFulfilled(manager.assume(BOOKMARKS))
  })

  it('Annotation runs a method if permission is included.', () => {
    return assert.isFulfilled(manager.test('1'), '11')
  })

  it('Assume method throws if permission is not included.', () => {
    manager.expectedResult = false

    return assert.isRejected(manager.assume(BOOKMARKS), PermissionNotGrantedException, BOOKMARKS)
  })

  it('Annotation throws if permission is not included.', () => {
    manager.expectedResult = false

    return assert.isRejected(manager.test('2'), PermissionNotGrantedException, BOOKMARKS)
  })

  chromeTests()

  extensionsTests()

  safariTests()
})
