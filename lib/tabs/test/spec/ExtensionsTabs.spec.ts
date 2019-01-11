import * as sinon from 'sinon'
import { expect } from 'chai'
import { Tabs } from '../../src/Tabs'
import { Container } from '@exteranto/ioc'
import { Browser } from '@exteranto/support'
import { Tab } from '../../src/extensions/Tab'
import * as browser from 'sinon-chrome/extensions'
import { TabIdUnknownException } from '@exteranto/exceptions'

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

  })
}
