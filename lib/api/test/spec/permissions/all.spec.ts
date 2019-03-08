import { expect } from 'chai'
import generate from '../../utils/generate'

import chrome from './chrome'
import extensions from './extensions'
import safari from './safari'

import {
  Permission,
  HasAccessTo,
  PermissionManager,
} from '@internal/permissions'

import { Container, Browser } from '@exteranto/core'
import { PermissionNotGrantedException } from '@internal/permissions/exceptions'

describe('Permissions', () => {
  let manager: PermissionManager

  beforeEach(() => {
    Container.getInstance().bindParam('browser', Browser.CHROME)
    Container.getInstance().bind<PermissionManager>(TestingPermissionManager).to(PermissionManager)
    manager = new TestingPermissionManager
  })

  it('enum const resolves to string', () => {
    expect(Permission.STORAGE).to.equal('storage')
  })

  it('assume method returns void if permission is included', async () => {
    return expect(manager.assume(Permission.STORAGE))
      .to.eventually.be.fulfilled
  })

  it('annotation runs a method if permission is included', async () => {
    return expect(new AnnotationTest().pass('1'))
      .to.eventually.equal('11')
  })

  it('assume method throws if permission is not included', async () => {
    return expect(manager.assume(Permission.BOOKMARKS))
      .to.eventually.be.rejectedWith(PermissionNotGrantedException)
  })

  it('annotation throws if permission is not included', async () => {
    return expect(new AnnotationTest().fail('1'))
      .to.eventually.be.rejectedWith(PermissionNotGrantedException)
  })

  generate({ chrome, extensions, safari })
})

export class TestingPermissionManager extends PermissionManager {
  public async contains (needle: string|string[]) : Promise<boolean> {
    return needle === 'storage'
  }
}

export class AnnotationTest {
  @HasAccessTo(PermissionManager.Permission.STORAGE)
  public pass (string: string) : string {
    return string + string
  }

  @HasAccessTo(PermissionManager.Permission.BOOKMARKS)
  public fail (string: string) : string {
    return string + string
  }
}
