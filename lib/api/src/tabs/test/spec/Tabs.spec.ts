import * as sinon from 'sinon'
import { expect } from 'chai'
import { Tabs } from '../../src/Tabs'
import * as chrome from 'sinon-chrome'
import { Container } from '@exteranto/ioc'
import { Browser } from '@exteranto/support'
import { chromeTests } from './ChromeTabs.spec'
import { extensionsTests } from './ExtensionsTabs.spec'

describe('Tabs API', () => {
  let tabs

  before(() => {
    Container.bindParam('browser', Browser.CHROME)

    tabs = Container.resolve(Tabs)
  })

  it('retrieves an active tab', async () => {
    chrome.tabs.query.yields([{ id: 1, active: true, currentWindow: true }])

    await expect(tabs.active().then(tab => (tab as any).tab.id))
      .to.eventually.equal(1)

    sinon.assert.calledOnce(chrome.tabs.query)
  })

  it('retrieves all tabs tab', async () => {
    chrome.tabs.query.yields([
      { id: 1, active: false, currentWindow: false },
      { id: 2, active: true, currentWindow: true }
    ])

    await expect(tabs.all())
      .to.eventually.have.lengthOf(2)

    sinon.assert.calledOnce(chrome.tabs.query)
  })

  it('retrieves all tabs in an active window', async () => {
    chrome.tabs.query.yields([
      { id: 1, active: false, currentWindow: true },
      { id: 2, active: true, currentWindow: true }
    ])

    await expect(tabs.allInCurrentWindow())
      .to.eventually.have.lengthOf(2)

    sinon.assert.calledOnce(chrome.tabs.query)
  })

  it('retrieves all pinned tabs', async () => {
    chrome.tabs.query.yields([
      { id: 1, pinned: true },
      { id: 2, pinned: true }
    ])

    await expect(tabs.pinned())
      .to.eventually.have.lengthOf(2)

    sinon.assert.calledOnce(chrome.tabs.query)
  })

  it('retrieves all tabs with a specific URL', async () => {
    chrome.tabs.query.yields([
      { id: 1, url: 'http://test.com' },
    ])

    await expect(tabs.withUrl('http://test.com'))
      .to.eventually.have.lengthOf(1)

    sinon.assert.calledOnce(chrome.tabs.query)
  })

  chromeTests()

  extensionsTests()

})
