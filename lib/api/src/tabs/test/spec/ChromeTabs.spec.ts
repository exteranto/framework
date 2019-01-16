import { expect } from 'chai'
import * as sinon from 'sinon'
import { Tabs } from '../../src/Tabs'
import * as chrome from 'sinon-chrome'
import { Container } from '@exteranto/ioc'
import { Tab } from '../../src/chrome/Tab'
import { Browser } from '@exteranto/support'
import { Dispatcher } from '@exteranto/events'
import { TabIdUnknownException } from '@exteranto/exceptions'
import {
  TabCreatedEvent,
  TabUpdatedEvent,
  TabActivatedEvent,
  TabRemovedEvent,
} from '../../src'

declare var global: any

export const chromeTests = () => {
  describe('Chrome', () => {
    let tabs

    before(() => {
      Container.bindParam('browser', Browser.CHROME)

      tabs = Container.resolve(Tabs)
    })

    afterEach(() => {
      Container.resolve(Dispatcher).events = {}
      chrome.runtime.lastError = undefined
    })

    it('opens a new tab', async () => {
      chrome.tabs.create.yields({ id: 1, url: 'http://test.com' })
      chrome.tabs.get.yields({ url: 'http://test.com' })

      const tab = await tabs.open('http://test.com')

      expect(await tab.url()).to.equal('http://test.com')

      sinon.assert.calledOnce(chrome.tabs.get)
      sinon.assert.calledOnce(chrome.tabs.create)
    })

    it('closes a tab', async () => {
      chrome.tabs.remove.yields(undefined)

      await expect(new Tab({ id: 1 }).close())
        .to.eventually.be.fulfilled

      sinon.assert.calledOnce(chrome.tabs.remove)
    })

    it('reloads the tab', async () => {
      chrome.tabs.reload.yields(undefined)

      await expect(new Tab({ id: 1 }).reload().then(tab => (tab as any).tab.id))
        .to.eventually.equal(1)

      sinon.assert.calledOnce(chrome.tabs.reload)
    })

    it('duplicates the tab', async () => {
      chrome.tabs.duplicate.yields({ id: 2 })

      await expect(new Tab({ id: 1 }).duplicate().then(tab => (tab as any).tab.id))
        .to.eventually.equal(2)

      sinon.assert.calledOnce(chrome.tabs.duplicate)
    })

    it('gets a tab by id', async () => {
      chrome.tabs.get.yields({ id: 2 })

      await expect(tabs.get(2)).to.eventually.have.property('id')
    })

    it('throws an exception if tab does not exist', async () => {
      chrome.tabs.get.yields()
      chrome.runtime.lastError = { message: 'Tab ID does not exist' }

      await expect(tabs.get(2)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('registers tab created event', (done) => {
      global.app.boot()

      Container.resolve(Dispatcher)
        .touch(TabCreatedEvent)
        .addHook((event: TabCreatedEvent) => {
          try {
            expect(event.getTab().id()).to.equal(1)
            done()
          } catch (e) { done(e) }
        })

      chrome.tabs.onCreated.trigger({ id: 1 })
    })

    it('registers tab updated event', (done) => {
      global.app.boot()

      Container.resolve(Dispatcher)
        .touch(TabUpdatedEvent)
        .addHook((event: TabUpdatedEvent) => {
          try {
            expect(event.getTab().id()).to.equal(2)
            done()
          } catch (e) { done(e) }
        })

      chrome.tabs.onUpdated.trigger(1, 2, { id: 2 })
    })

    it('registers tab activated event', (done) => {
      global.app.boot()

      Container.resolve(Dispatcher)
        .touch(TabActivatedEvent)
        .addHook((event: TabActivatedEvent) => {
          try {
            expect(event.getTabId()).to.equal(3)
            done()
          } catch (e) { done(e) }
        })

      chrome.tabs.onActivated.trigger({ tabId: 3 })
    })

    it('registers tab removed event', (done) => {
      global.app.boot()

      Container.resolve(Dispatcher)
        .touch(TabRemovedEvent)
        .addHook((event: TabRemovedEvent) => {
          try {
            expect(event.getTabId()).to.equal(4)
            done()
          } catch (e) { done(e) }
        })

      chrome.tabs.onRemoved.trigger(4)
    })

  })
}
