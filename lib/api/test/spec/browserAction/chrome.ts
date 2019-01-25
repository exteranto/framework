import { expect } from 'chai'
import { mock, instance, verify, deepEqual } from 'ts-mockito'

import { Dispatcher } from '@exteranto/core'
import { TabIdUnknownException } from '@exteranto/exceptions'
import { BrowserAction, BrowserActionClickedEvent } from '@internal/browserAction'
import { BrowserAction as ChromeBrowserAction } from '@internal/browserAction/chrome/BrowserAction'

export default ({ chrome }) => {
  let browserAction: BrowserAction
  let dispatcher: Dispatcher

  beforeEach(() => {
    dispatcher = mock(Dispatcher)
    browserAction = new ChromeBrowserAction
  })

  it('sets a badge text.', async () => {
    chrome.browserAction.setBadgeText.yields(undefined)

    await expect(browserAction.setBadgeText('test', 1)).to.eventually.be.fulfilled
  })

  it('rejects when trying to set a badge text of an unknown tab.', async () => {
    chrome.runtime.lastError = { message: 'test' };
    chrome.browserAction.setBadgeText.yields(undefined)

    await expect(browserAction.setBadgeText('test', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

  it('gets a badge text.', async () => {
    chrome.browserAction.getBadgeText.yields('test')

    await expect(browserAction.getBadgeText(1)).to.eventually.equal('test')
  })

  it('rejects when trying to get a badge text of an unknown tab.', async () => {
    chrome.runtime.lastError = { message: 'test' };
    chrome.browserAction.getBadgeText.yields(undefined)

    await expect(browserAction.getBadgeText(123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

  it('sets a badge background color.', async () => {
    chrome.browserAction.setBadgeBackgroundColor.yields(undefined)

    await expect(browserAction.setBadgeColor('#000', 1)).to.eventually.be.fulfilled
  })

  it('rejects when trying to set a badge background color of an unknown tab.', async () => {
    chrome.runtime.lastError = { message: '#000' };
    chrome.browserAction.setBadgeBackgroundColor.yields(undefined)

    await expect(browserAction.setBadgeColor('#000', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

  it('gets a badge background color.', async () => {
    chrome.browserAction.getBadgeBackgroundColor.yields('#000')

    await expect(browserAction.getBadgeColor(1)).to.eventually.equal('#000')
  })

  it('rejects when trying to get a badge background color of an unknown tab.', async () => {
    chrome.runtime.lastError = { message: '#000' };
    chrome.browserAction.getBadgeBackgroundColor.yields(undefined)

    await expect(browserAction.getBadgeColor(123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

  it('sets the extension title.', async () => {
    chrome.browserAction.setTitle.yields(undefined)
    await expect(browserAction.setTitle('test', 1)).to.eventually.be.fulfilled
    await expect(chrome.browserAction.setTitle.calledOnce).to.be.true
  })

  it('rejects when trying to set a title text in an unknown tab.', async () => {
    chrome.runtime.lastError = { message: 'test' };
    chrome.browserAction.setTitle.yields(undefined)
    await expect(browserAction.setTitle('test', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    await expect(chrome.browserAction.setTitle.calledOnce).to.be.true
  })

  it('retruns the extension title.', async () => {
    chrome.browserAction.getTitle.yields('title')
    await expect(browserAction.getTitle(1)).to.eventually.equal('title')
    await expect(chrome.browserAction.getTitle.calledOnce).to.be.true
  })

  it('rejects when trying to get a title text in an unknown tab.', async () => {
    chrome.runtime.lastError = { message: 'test' };
    chrome.browserAction.getTitle.yields('title')
    await expect(browserAction.getTitle(123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    await expect(chrome.browserAction.getTitle.calledOnce).to.be.true
  })

  it('sets the extension icon.', async () => {
    chrome.browserAction.setIcon.yields(undefined)
    await expect(browserAction.setIcon('test.png', 1)).to.eventually.be.fulfilled
    await expect(chrome.browserAction.setIcon.calledOnce).to.be.true
  })

  it('sets the extension icon as an object.', async () => {
    chrome.browserAction.setIcon.yields(undefined)
    await expect(browserAction.setIcon({ 16: 'test.png' }, 1)).to.eventually.be.fulfilled
    await expect(chrome.browserAction.setIcon.calledOnce).to.be.true
  })

  it('rejects when trying to set a icon text in an unknown tab.', async () => {
    chrome.runtime.lastError = { message: 'test' };
    chrome.browserAction.setIcon.yields(undefined)
    await expect(browserAction.setIcon('test.png', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    await expect(chrome.browserAction.setIcon.calledOnce).to.be.true
  })

  it('registers badge click event.', (  ) => {
    browserAction.registerEvents(instance(dispatcher))

    chrome.browserAction.onClicked.trigger({ id: 2 })

    verify(dispatcher.fire(deepEqual(new BrowserActionClickedEvent(2)))).once()
  })
}
