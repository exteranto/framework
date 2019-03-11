import { expect } from 'chai'
import * as sinon from 'sinon'
import { mock, instance, verify, deepEqual } from 'ts-mockito'

import {
  Tabs,
  TabCreatedEvent,
  TabUpdatedEvent,
  TabActivatedEvent,
  TabRemovedEvent,
} from '@internal/tabs'

import { Dispatcher } from '@exteranto/core'
import { Tab } from '@internal/tabs/extensions/Tab'
import { TabIdUnknownException } from '@internal/tabs/exceptions'
import { Tabs as ExtensionsTabs } from '@internal/tabs/extensions/Tabs'

export default ({ browser }) => {
  let tabs: Tabs
  let dispatcher: Dispatcher

  beforeEach(() => {
    dispatcher = mock(Dispatcher)
    tabs = new ExtensionsTabs
  })

  it('opens a new tab', async () => {
    browser.tabs.create.resolves({ id: 1, url: 'http://test.com' })
    browser.tabs.get.resolves({ url: 'http://test.com' })

    const tab = await tabs.open('http://test.com')

    expect(await tab.url()).to.equal('http://test.com')

    sinon.assert.calledOnce(browser.tabs.get)
    sinon.assert.calledOnce(browser.tabs.create)
  })

  it('closes a tab', async () => {
    browser.tabs.remove.resolves(undefined)

    await expect(new Tab({ id: 1 }).close())
      .to.eventually.be.fulfilled

    sinon.assert.calledOnce(browser.tabs.remove)
  })

  it('reloads the tab', async () => {
    browser.tabs.reload.resolves(undefined)

    await expect(new Tab({ id: 1 }).reload().then(tab => (tab as any).tab.id))
      .to.eventually.equal(1)

    sinon.assert.calledOnce(browser.tabs.reload)
  })

  it('duplicates the tab', async () => {
    browser.tabs.duplicate.resolves({ id: 2 })

    await expect(new Tab({ id: 1 }).duplicate().then(tab => (tab as any).tab.id))
      .to.eventually.equal(2)

    sinon.assert.calledOnce(browser.tabs.duplicate)
  })

  it('activates a tab', async () => {
    browser.tabs.update.resolves({ id: 2 })

    await expect(new Tab({ id: 1 }).activate())
      .to.eventually.be.instanceOf(Tab)

    sinon.assert.calledOnce(browser.tabs.update)
  })

  it('pins a tab', async () => {
    browser.tabs.update.resolves({ id: 2 })

    await expect(new Tab({ id: 1 }).pin())
      .to.eventually.be.instanceOf(Tab)

    sinon.assert.calledOnce(browser.tabs.update)
  })

  it('unpins a tab', async () => {
    browser.tabs.update.resolves({ id: 2 })

    await expect(new Tab({ id: 1 }).unpin())
      .to.eventually.be.instanceOf(Tab)

    sinon.assert.calledOnce(browser.tabs.update)
  })

  it('gets a tab by id', async () => {
    browser.tabs.get.resolves({ id: 2 })

    await expect(tabs.get(2).then(t => t.id()))
      .to.eventually.equal(2)
  })

  it('throws an exception if tab does not exist', async () => {
    browser.tabs.get.rejects()

    await expect(tabs.get(2)).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

  it('registers tab created event', () => {
    tabs.registerEvents(instance(dispatcher))

    browser.tabs.onCreated.trigger({ id: 1 })

    verify(dispatcher.fire(deepEqual(new TabCreatedEvent(new Tab({ id: 1 })))))
      .once()
  })

  it('registers tab updated event', () => {
    tabs.registerEvents(instance(dispatcher))

    browser.tabs.onUpdated.trigger(1, 2, { id: 2 })

    verify(dispatcher.fire(deepEqual(new TabUpdatedEvent(new Tab({ id: 2 })))))
      .once()
  })

  it('registers tab activated event', () => {
    tabs.registerEvents(instance(dispatcher))

    browser.tabs.onActivated.trigger({ tabId: 3 })

    verify(dispatcher.fire(deepEqual(new TabActivatedEvent(3))))
      .once()
  })

  it('registers tab removed event', () => {
    tabs.registerEvents(instance(dispatcher))

    browser.tabs.onRemoved.trigger(4)

    verify(dispatcher.fire(deepEqual(new TabRemovedEvent(4))))
      .once()
  })
}
