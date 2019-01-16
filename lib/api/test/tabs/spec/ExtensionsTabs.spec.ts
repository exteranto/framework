import * as sinon from 'sinon'
import { expect } from 'chai'
import { Tabs } from '../../../src'
import { Container } from '@exteranto/core'
import { Browser } from '@exteranto/core'
import { Tab } from '../../../src/tabs/extensions/Tab'
import * as browser from 'sinon-chrome/extensions'
import { Dispatcher } from '@exteranto/core'
import { TabIdUnknownException } from '@exteranto/exceptions'
import {
  TabCreatedEvent,
  TabUpdatedEvent,
  TabActivatedEvent,
  TabRemovedEvent,
} from '../../../src'

declare var global: any

export const extensionsTests = () => {
  describe('Extensions', () => {
    let tabs

    before(() => {
      Container.bindParam('browser', Browser.EXTENSIONS)

      tabs = Container.resolve(Tabs)
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

    it('gets a tab by id', async () => {
      browser.tabs.get.resolves({ id: 2 })

      await expect(tabs.get(2)).to.eventually.have.property('id')
    })

    it('throws an exception if tab does not exist', async () => {
      browser.tabs.get.rejects()

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

      browser.tabs.onCreated.trigger({ id: 1 })
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

      browser.tabs.onUpdated.trigger(1, 2, { id: 2 })
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

      browser.tabs.onActivated.trigger({ tabId: 3 })
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

      browser.tabs.onRemoved.trigger(4)
    })

  })
}
