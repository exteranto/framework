import { expect } from 'chai'
import * as sinon from 'sinon'
import { mock, instance, verify, deepEqual } from 'ts-mockito'

import {
  Tabs,
  TabInterface,
  TabCreatedEvent,
  TabUpdatedEvent,
  TabRemovedEvent,
  TabActivatedEvent,
} from '@internal/tabs'

import { Dispatcher } from '@exteranto/core'
import { Tab } from '@internal/tabs/safari/Tab'
import { Tabs as SafariTabs } from '@internal/tabs/safari/Tabs'
import { TabIdUnknownException, NoActiveTabException, TabHasNoFaviconException } from '@internal/tabs/exceptions'

export default ({ safari }) => {
  let tabs: Tabs
  let dispatcher: Dispatcher
  let testTab: TabInterface

  beforeEach(() => {
    dispatcher = mock(Dispatcher)
    tabs = new SafariTabs

    safari.application.activeBrowserWindow = {
      openTab: sinon.stub()
    }

    testTab = new Tab({
      browserWindow: 0,
      id: 1,
      url: 'test',
    })
  })

  it('opens a new tab', async () => {
    safari.application.activeBrowserWindow.activeTab = {
      activate: () => null
    }

    safari.application.activeBrowserWindow.openTab.returns({
      browserWindow: 0,
    })

    const tab = await tabs.open('http://test.com')

    expect(await tab.url()).to.equal('http://test.com')
    sinon.assert.calledOnce(safari.application.activeBrowserWindow.openTab)
  })

  it('returns the active tab', async () => {
    const activeTab = { eid: 2, meta: {} }
    const activeWindow = { eid: 1, activeTab, tabs: [activeTab] }

    safari.application.browserWindows = [activeWindow]
    safari.application.activeBrowserWindow = activeWindow

    await expect(tabs.active()).to.eventually.be.instanceOf(Tab)
    await expect(tabs.active().then(tab => tab.id())).to.eventually.equal(2)
  })

  it('throws an exception if no active tab found', async () => {
    const activeWindow = { eid: 1, tabs: [{ eid: 2, meta: {} }] }

    safari.application.browserWindows = [activeWindow]
    safari.application.activeBrowserWindow = activeWindow

    await expect(tabs.active()).to.eventually.be.rejectedWith(NoActiveTabException)
  })

  it('closes a tab', async () => {
    const close = sinon.stub()

    await expect(new Tab({ id: 1, close, browserWindow: 0 }).close())
      .to.eventually.be.fulfilled

    sinon.assert.calledOnce(close)
  })

  it('reloads a tab', async () => {
    await expect(testTab.reload().then(t => t.url()))
      .to.eventually.equal('test')
  })

  it('duplicates a tab', async () => {
    const tabs = mock(SafariTabs)
    const tab = testTab
    ;(tab as any).tabs = instance(tabs)

    await tab.duplicate()

    verify(tabs.open((tab as any).tab, true)).once()
  })

  it('pins a tab', async () => {
    await expect(testTab.pin()).to.eventually.be.instanceOf(Tab)
  })

  it('unpins a tab', async () => {
    await expect(testTab.unpin()).to.eventually.be.instanceOf(Tab)
  })

  it('gets a tab by id', async () => {
    const browserWindow = {
      tabs: [
        { eid: 123, meta: {} }
      ]
    }

    safari.application.activeBrowserWindow = browserWindow
    safari.application.browserWindows = [browserWindow]

    await expect(tabs.get(123).then(t => t.id()))
      .to.eventually.equal(123)
  })

  it('resolves with a title', async () => {

    await expect(new Tab({ title: 'test' }).title())
      .to.eventually.equal('test')
  })

  it('throws an exception if favicon method is called', async () => {
    await expect(new Tab({}).favicon())
      .to.eventually.be.rejectedWith(TabHasNoFaviconException)
  })

  it('throws an exception if tab does not exist', async () => {
    const browserWindow = {
      tabs: [
        { eid: 125, meta: {} }
      ]
    }

    safari.application.activeBrowserWindow = browserWindow
    safari.application.browserWindows = [browserWindow]

    await expect(tabs.get(124)).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

  it('registers tab created event', () => {
    tabs.registerEvents(instance(dispatcher))
    Date.now = sinon.stub().returns(1)

    const target = new SafariTabMock('http://test.com')
    safari.application.trigger('open', { target })

    verify(dispatcher.fire(deepEqual(new TabCreatedEvent(target.eid))))
      .once()

    expect((target as any).eid).to.equal(1)
  })

  it('registers tab updated event for navigate event', () => {
    tabs.registerEvents(instance(dispatcher))
    Date.now = sinon.stub().returns(2)

    const target = new SafariTabMock('http://test.com')
    safari.application.trigger('open', { target })

    target.trigger('navigate')

    verify(dispatcher.fire(deepEqual(new TabUpdatedEvent(target.eid, {
      status: 'complete',
    }))))
      .once()

    expect((target as any).eid).to.equal(2)
  })

  it('registers tab updated event for beforeNavigate event with same url', () => {
    tabs.registerEvents(instance(dispatcher))
    Date.now = sinon.stub().returns(2)

    const target = new SafariTabMock('http://test.com')
    safari.application.trigger('open', { target })

    target.trigger('beforeNavigate', {
      url: 'test',
      target: { url: 'test' },
    })

    verify(dispatcher.fire(deepEqual(new TabUpdatedEvent(target.eid, {
      status: 'loading',
      url: undefined,
    }))))
      .once()

    expect((target as any).eid).to.equal(2)
  })

  it('registers tab updated event for beforeNavigate event with different url', () => {
    tabs.registerEvents(instance(dispatcher))
    Date.now = sinon.stub().returns(2)

    const target = new SafariTabMock('http://test.com')
    safari.application.trigger('open', { target })

    target.trigger('beforeNavigate', {
      url: 'test',
      target: { url: 'test2' },
    })

    verify(dispatcher.fire(deepEqual(new TabUpdatedEvent(target.eid, {
      status: 'loading',
      url: 'test',
    }))))
      .once()

    expect((target as any).eid).to.equal(2)
  })

  it('registers tab activated event', () => {
    tabs.registerEvents(instance(dispatcher))
    Date.now = sinon.stub().returns(3)

    const target = new SafariTabMock('http://test.com')
    safari.application.trigger('open', { target })

    target.trigger('activate')

    verify(dispatcher.fire(deepEqual(new TabActivatedEvent(3))))
      .once()

    expect((target as any).eid).to.equal(3)
  })

  it('registers tab removed event', () => {
    tabs.registerEvents(instance(dispatcher))
    Date.now = sinon.stub().returns(4)

    const target = new SafariTabMock('http://test.com')
    safari.application.trigger('open', { target })

    target.trigger('close')

    verify(dispatcher.fire(deepEqual(new TabRemovedEvent(4))))
      .once()

    expect((target as any).eid).to.equal(4)
  })

  it('throws an exception if any method is called on a non existing tab', async () => {
    const tab: TabInterface = new Tab({ id: 1 })

    await expect(tab.activate()).to.eventually.be.rejectedWith(TabIdUnknownException)
    await expect(tab.url()).to.eventually.be.rejectedWith(TabIdUnknownException)
    await expect(tab.close()).to.eventually.be.rejectedWith(TabIdUnknownException)
    await expect(tab.reload()).to.eventually.be.rejectedWith(TabIdUnknownException)
    await expect(tab.duplicate()).to.eventually.be.rejectedWith(TabIdUnknownException)
    await expect(tab.pin()).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

}

class SafariTabMock {
  public eid: number

  private listeners = {}

  constructor (public url: string) {
    //
  }

  public addEventListener (name, cb) {
    this.listeners[name] === undefined
      ? this.listeners[name] = [cb]
      : this.listeners[name].push(cb)
  }

  public trigger (name, payload?) {
    this.listeners[name].forEach(l => l(payload))
  }
}
