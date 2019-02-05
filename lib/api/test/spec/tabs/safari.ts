import { expect } from 'chai'
import * as sinon from 'sinon'
import { mock, instance, verify, deepEqual, anything } from 'ts-mockito'

import {
  Tabs,
  TabCreatedEvent,
  TabUpdatedEvent,
  TabActivatedEvent,
  TabRemovedEvent,
} from '@internal/tabs'

import { Dispatcher } from '@exteranto/core'
import { Tab } from '@internal/tabs/safari/Tab'
import { TabIdUnknownException } from '@exteranto/exceptions'
import { Tabs as SafariTabs } from '@internal/tabs/safari/Tabs'

export default ({ safari }) => {
  let tabs: Tabs
  let dispatcher: Dispatcher

  beforeEach(() => {
    dispatcher = mock(Dispatcher)
    tabs = new SafariTabs

    safari.application.activeBrowserWindow = {
      openTab: sinon.stub()
    }
  })

  it('opens a new tab', async () => {
    safari.application.activeBrowserWindow.openTab.returns({})

    const tab = await tabs.open('http://test.com')

    expect(await tab.url()).to.equal('http://test.com')
    sinon.assert.calledOnce(safari.application.activeBrowserWindow.openTab)
  })

  it('closes a tab', async () => {
    const close = sinon.stub()

    await expect(new Tab({ id: 1, close }).close())
      .to.eventually.be.fulfilled

    sinon.assert.calledOnce(close)
  })

  it('reloads a tab', async () => {
    await expect(new Tab({ url: 'test' }).reload().then(t => t.url()))
      .to.eventually.equal('test')
  })

  it('duplicates a tab', async () => {
    const tabs = mock(SafariTabs)
    const tab = new Tab({ url: 'test' })
    ;(tab as any).tabs = instance(tabs)

    await tab.duplicate()

    verify(tabs.open((tab as any).tab, true)).once()
  })

  it('pins a tab', async () => {
    await expect(new Tab({ url: 'test' }).pin())
      .to.eventually.be.instanceOf(Tab)
  })

  it('unpins a tab', async () => {
    await expect(new Tab({ url: 'test' }).unpin())
      .to.eventually.be.instanceOf(Tab)
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

    verify(dispatcher.fire(deepEqual(new TabCreatedEvent(new Tab(target)))))
      .once()

    expect((target as any).eid).to.equal(1)
  })

  it('registers tab updated event', () => {
    tabs.registerEvents(instance(dispatcher))
    Date.now = sinon.stub().returns(2)

    const target = new SafariTabMock('http://test.com')
    safari.application.trigger('open', { target })

    target.trigger('navigate')

    verify(dispatcher.fire(deepEqual(new TabUpdatedEvent(new Tab(target)))))
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
}

class SafariTabMock {
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
