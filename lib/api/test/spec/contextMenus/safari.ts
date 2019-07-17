import { expect } from 'chai'
import { mock, instance, verify, deepEqual } from 'ts-mockito'

import { Dispatcher } from '@exteranto/core'
import { ContextMenus } from '@internal/contextMenus'
import { ContextMenus as SafaricontextMenus } from '@internal/contextMenus/safari/ContextMenus'

export default ({ safari }) => {
  let contextMenus: ContextMenus
  let dispatcher: Dispatcher

  beforeEach(() => {
    dispatcher = mock(Dispatcher)
    contextMenus = new SafaricontextMenus

    ;(contextMenus as any).dispatcher = instance(dispatcher)
  })

  it('adds a context menu item')
  it('changes a context menu item')
  it('removes a context menu item')
  it('removes all context menus')
}
