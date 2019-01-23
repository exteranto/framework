import { expect } from 'chai'
import { Dispatcher } from '@exteranto/core'
import { mock, instance, verify, deepEqual } from 'ts-mockito'
import { TabIdUnknownException } from '@exteranto/exceptions'
import { BrowserAction, BrowserActionClickedEvent } from '@internal/browserAction'
import { BrowserAction as ExtensionsBrowserAction } from '@internal/browserAction/extensions/BrowserAction'

export default ({ browser }) => {
  let browserAction: BrowserAction
  let dispatcher: Dispatcher

  before(() => {
    dispatcher = mock(Dispatcher)
    browserAction = new ExtensionsBrowserAction
  })

  it('sets a badge text.', async () => {
    browser.browserAction.setBadgeText.resolves(undefined)

    await expect(browserAction.setBadgeText('test', 1)).to.eventually.be.fulfilled
  })

  it('rejects when trying to set a badge text of an unknown tab.', async () => {
    browser.browserAction.setBadgeText.rejects(TabIdUnknownException)

    await expect(browserAction.setBadgeText('test', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

  it('gets a badge text.', async () => {
    browser.browserAction.getBadgeText.resolves('test')

    await expect(browserAction.getBadgeText(1)).to.eventually.equal('test')
  })

  it('rejects when trying to get a badge text of an unknown tab.', async () => {
    browser.browserAction.getBadgeText.rejects(TabIdUnknownException)

    await expect(browserAction.getBadgeText(123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

  it('sets a badge background color.', async () => {
    browser.browserAction.setBadgeBackgroundColor.resolves(undefined)

    await expect(browserAction.setBadgeColor('#000', 1)).to.eventually.be.fulfilled
  })

  it('rejects when trying to set a badge background color of an unknown tab.', async () => {
    browser.browserAction.setBadgeBackgroundColor.rejects(TabIdUnknownException)

    await expect(browserAction.setBadgeColor('#000', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

  it('gets a badge background color.', async () => {
    browser.browserAction.getBadgeBackgroundColor.resolves('#000')

    await expect(browserAction.getBadgeColor(1)).to.eventually.equal('#000')
  })

  it('rejects when trying to get a badge background color of an unknown tab.', async () => {
    browser.browserAction.getBadgeBackgroundColor.rejects(TabIdUnknownException)

    await expect(browserAction.getBadgeColor(123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

  it('sets the extension title.', async () => {
    browser.browserAction.setTitle.resolves(undefined)
    await expect(browserAction.setTitle('test', 1)).to.eventually.be.fulfilled
    await expect(browser.browserAction.setTitle.calledOnce).to.be.true
  })

  it('rejects when trying to set a title text in an unknown tab.', async () => {
    browser.browserAction.setTitle.throws(TabIdUnknownException)
    await expect(browserAction.setTitle('test', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    await expect(browser.browserAction.setTitle.calledOnce).to.be.true
  })

  it('retruns the extension title.', async () => {
    browser.browserAction.getTitle.resolves('title')
    await expect(browserAction.getTitle(1)).to.eventually.equal('title')
    await expect(browser.browserAction.getTitle.calledOnce).to.be.true
  })

  it('rejects when trying to get a title text in an unknown tab.', async () => {
    browser.browserAction.getTitle.rejects(TabIdUnknownException)
    await expect(browserAction.getTitle(123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    await expect(browser.browserAction.getTitle.calledOnce).to.be.true
  })

  it('sets the extension icon.', async () => {
    browser.browserAction.setIcon.resolves(undefined)
    await expect(browserAction.setIcon('test.png', 1)).to.eventually.be.fulfilled
    await expect(browser.browserAction.setIcon.calledOnce).to.be.true
  })

  it('sets the extension icon as an object.', async () => {
    browser.browserAction.setIcon.resolves(undefined)
    await expect(browserAction.setIcon({ 16: 'test.png' }, 1)).to.eventually.be.fulfilled
    await expect(browser.browserAction.setIcon.calledOnce).to.be.true
  })

  it('rejects when trying to set a icon text in an unknown tab.', async () => {
    browser.browserAction.setIcon.rejects(TabIdUnknownException)
    await expect(browserAction.setIcon('test.png', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    await expect(browser.browserAction.setIcon.calledOnce).to.be.true
  })

  it('registers badge click event.', () => {
    browserAction.registerEvents(instance(dispatcher))

    browser.browserAction.onClicked.trigger({ id: 2 })

    verify(dispatcher.fire(deepEqual(new BrowserActionClickedEvent(2)))).once()
  })
}
