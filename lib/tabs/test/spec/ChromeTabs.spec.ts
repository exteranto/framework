import * as sinon from 'sinon'
import { expect } from 'chai'
import { Tabs } from '../../src/Tabs'
import * as chrome from 'sinon-chrome'
import { Container } from '@exteranto/ioc'
import { Tab } from '../../src/chrome/Tab'
import { Browser } from '@exteranto/support'
import { TabIdUnknownException } from '@exteranto/exceptions'

export const chromeTests = () => {
  describe('Chrome', () => {
    let tabs

    before(() => {
      Container.bindParam('browser', Browser.CHROME)

      tabs = Container.resolve(Tabs)
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

  })
}
