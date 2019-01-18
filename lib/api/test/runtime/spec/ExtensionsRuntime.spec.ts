import * as sinon from 'sinon'
import { expect } from 'chai'
import * as browser from 'sinon-chrome/extensions'
import { Container, Browser, Dispatcher } from '@exteranto/core'
import { InvalidUrlFormatException } from '@exteranto/exceptions'
import {
  Runtime,
  ExtensionInstalledEvent,
  ExtensionUpdatedEvent,
  WebRequestBeforeRedirectedEvent,
  WebRequestCompletedEvent,
} from '../../../src'

declare var global: any

export const tests = () => {
  describe('Extensions', () => {
    let runtime
    let dispatcher

    before(() => {
      Container.bindParam('browser', Browser.EXTENSIONS)

      runtime = Container.resolve(Runtime)

      dispatcher = Container.resolve(Dispatcher)
    })

    afterEach(() => {
      dispatcher.events = {}
    })

    it('sets uninstall url', () => {
      browser.runtime.setUninstallURL.resolves('https://test.com')

      runtime.setUninstallUrl('https://test.com')

      sinon.assert.calledOnce(browser.runtime.setUninstallURL)
      sinon.assert.calledWith(browser.runtime.setUninstallURL, 'https://test.com')
    })

    it('throws an exception if uninstall url is invalid', async () => {
      browser.runtime.setUninstallURL.rejects()

      await expect(runtime.setUninstallUrl('invalid'))
        .to.eventually.be.rejectedWith(InvalidUrlFormatException)

      sinon.assert.calledOnce(browser.runtime.setUninstallURL)
    })

    it('converts relative path to url', async () => {
      browser.runtime.getURL.returns('browser://extension/abc/path')

      expect(runtime.extensionUrl('path'))
        .to.equal('browser://extension/abc/path')
      expect(browser.runtime.getURL.calledOnce).to.be.true
    })

    it('registers install event', (done) => {
      global.app.boot()

      Container.resolve(Dispatcher)
        .touch(ExtensionInstalledEvent)
        .addHook((_: ExtensionInstalledEvent) => {
          try {
            done()
          } catch (e) { done(e) }
        })

      browser.runtime.onInstalled.trigger({
        reason: 'install'
      })
    })

    it('registers update event', (done) => {
      global.app.boot()

      Container.resolve(Dispatcher)
        .touch(ExtensionUpdatedEvent)
        .addHook((event: ExtensionUpdatedEvent) => {
          try {
            expect(event.previousVersion()).to.equal('0.0.0')
            done()
          } catch (e) { done(e) }
        })

      browser.runtime.onInstalled.trigger({
        reason: 'update',
        previousVersion: '0.0.0'
      })
    })

    it('registers web request on before redirect event', (done) => {
      global.app.boot()

      Container.resolve(Dispatcher)
        .touch(WebRequestBeforeRedirectedEvent)
        .addHook((event: WebRequestBeforeRedirectedEvent) => {
          try {
            expect(event.tabId()).to.equal(2)
            done()
          } catch (e) { done(e) }
        })

      browser.webRequest.onBeforeRedirect.trigger({
        tabId: 2
      })
    })

    it('registers web request on completed event', (done) => {
      global.app.boot()

      Container.resolve(Dispatcher)
        .touch(WebRequestCompletedEvent)
        .addHook((event: WebRequestCompletedEvent) => {
          try {
            expect(event.tabId()).to.equal(2)
            done()
          } catch (e) { done(e) }
        })

      browser.webRequest.onCompleted.trigger({
        tabId: 2
      })
    })

  })
}
