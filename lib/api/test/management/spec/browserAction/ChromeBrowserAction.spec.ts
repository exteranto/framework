import { expect } from 'chai'
import * as chrome from 'sinon-chrome'

import { Container } from '@exteranto/core'
import { Browser } from '@exteranto/core'
import { Dispatcher } from '@exteranto/core'

import { BrowserAction } from '../../../../src'
import { BrowserActionClickedEvent } from '../../../../src/'
import { TabIdUnknownException } from '@exteranto/exceptions'

declare var global: any

export const tests = () => {
  describe('Chrome', () => {
    let dispatcher
    let browserAction

    before(() => {
      Container.bindParam('browser', Browser.CHROME)

      browserAction = Container.resolve(BrowserAction)

      dispatcher = Container.resolve(Dispatcher)
    })

    afterEach(() => {
      dispatcher.events = {}
    })

    it('Sets a badge text.', async () => {
      chrome.browserAction.setBadgeText.yields(undefined)

      await expect(browserAction.setBadgeText('test', 1)).to.eventually.be.fulfilled
    })

    it('Rejects when trying to set a badge text of an unknown tab.', async () => {
      chrome.runtime.lastError = { message: 'test' };
      chrome.browserAction.setBadgeText.yields(undefined)

      await expect(browserAction.setBadgeText('test', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('Gets a badge text.', async () => {
      chrome.browserAction.getBadgeText.yields('test')

      await expect(browserAction.getBadgeText(1)).to.eventually.equal('test')
    })

    it('Rejects when trying to get a badge text of an unknown tab.', async () => {
      chrome.runtime.lastError = { message: 'test' };
      chrome.browserAction.getBadgeText.yields(undefined)

      await expect(browserAction.getBadgeText('test', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('Sets a badge background color.', async () => {
      chrome.browserAction.setBadgeBackgroundColor.yields(undefined)

      await expect(browserAction.setBadgeColor('#000', 1)).to.eventually.be.fulfilled
    })

    it('Rejects when trying to set a badge background color of an unknown tab.', async () => {
      chrome.runtime.lastError = { message: '#000' };
      chrome.browserAction.setBadgeBackgroundColor.yields(undefined)

      await expect(browserAction.setBadgeColor('#000', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('Gets a badge background color.', async () => {
      chrome.browserAction.getBadgeBackgroundColor.yields('#000')

      await expect(browserAction.getBadgeColor(1)).to.eventually.equal('#000')
    })

    it('Rejects when trying to get a badge background color of an unknown tab.', async () => {
      chrome.runtime.lastError = { message: '#000' };
      chrome.browserAction.getBadgeBackgroundColor.yields(undefined)

      await expect(browserAction.getBadgeColor('#000', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('Sets the extension title.', async () => {
      chrome.browserAction.setTitle.yields(undefined)
      await expect(browserAction.setTitle('test', 1)).to.eventually.be.fulfilled
      await expect(chrome.browserAction.setTitle.calledOnce).to.be.true
    })

    it('Rejects when trying to set a title text in an unknown tab.', async () => {
      chrome.runtime.lastError = { message: 'test' };
      chrome.browserAction.setTitle.yields(undefined)
      await expect(browserAction.setTitle('test', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
      await expect(chrome.browserAction.setTitle.calledOnce).to.be.true
    })

    it('Retruns the extension title.', async () => {
      chrome.browserAction.getTitle.yields('title')
      await expect(browserAction.getTitle(1)).to.eventually.equal('title')
      await expect(chrome.browserAction.getTitle.calledOnce).to.be.true
    })

    it('Rejects when trying to get a title text in an unknown tab.', async () => {
      chrome.runtime.lastError = { message: 'test' };
      chrome.browserAction.getTitle.yields('title')
      await expect(browserAction.getTitle(123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
      await expect(chrome.browserAction.getTitle.calledOnce).to.be.true
    })

    it('Sets the extension icon.', async () => {
      chrome.browserAction.setIcon.yields(undefined)
      await expect(browserAction.setIcon('test.png', 1)).to.eventually.be.fulfilled
      await expect(chrome.browserAction.setIcon.calledOnce).to.be.true
    })

    it('Sets the extension icon as an object.', async () => {
      chrome.browserAction.setIcon.yields(undefined)
      await expect(browserAction.setIcon({ 16: 'test.png' }, 1)).to.eventually.be.fulfilled
      await expect(chrome.browserAction.setIcon.calledOnce).to.be.true
    })

    it('Rejects when trying to set a icon text in an unknown tab.', async () => {
      chrome.runtime.lastError = { message: 'test' };
      chrome.browserAction.setIcon.yields(undefined)
      await expect(browserAction.setIcon('test.png', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
      await expect(chrome.browserAction.setIcon.calledOnce).to.be.true
    })

    it('Registers badge click event.', (done) => {
      global.app.boot()

      Container.resolve(Dispatcher)
        .touch(BrowserActionClickedEvent)
        .addHook((event: BrowserActionClickedEvent) => {
          try {
            expect(event.tabId()).to.equal(2)
            done()
          } catch (e) { done(e) }
        })

      chrome.tabs.get.yields({ id: 2 })
      chrome.browserAction.onClicked.trigger({ id: 2 })
    })
  })
}
