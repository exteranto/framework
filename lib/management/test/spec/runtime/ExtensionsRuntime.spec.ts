import * as sinon from 'sinon'
import { expect } from 'chai'
import * as browser from 'sinon-chrome/extensions'
import { Container } from '@exteranto/ioc'
import { Browser } from '@exteranto/support'
import { Dispatcher } from '@exteranto/events'
import { Runtime } from '../../../src/runtime/Runtime'
import { InvalidUrlFormatException } from '@exteranto/exceptions'

declare var global: any

export const tests = () => {
  describe('Extensions', () => {
    let runtime

    before(() => {
      Container.bindParam('browser', Browser.EXTENSIONS)

      runtime = Container.resolve(Runtime)
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

    it('registers install event', async () => {
      await global.app.boot()

      const installed = sinon.spy()

      Container.resolve(Dispatcher)
        .touch('app.management.runtime.installed')
        .addHook(installed)

      browser.runtime.onInstalled.trigger({
        reason: 'install'
      })

      sinon.assert.calledOnce(installed)
    })

    it('registers update event', async () => {
      await global.app.boot()

      const updated = sinon.spy()

      Container.resolve(Dispatcher)
        .touch('app.management.runtime.updated')
        .addHook(updated)

      browser.runtime.onInstalled.trigger({
        reason: 'update',
        previousVersion: '0.0.0'
      })

      sinon.assert.calledOnce(updated)
    })

    it('registers browser update event', async () => {
      await global.app.boot()

      const browserUpdated = sinon.spy()

      Container.resolve(Dispatcher)
        .touch('app.management.runtime.browserUpdated')
        .addHook(browserUpdated)

      browser.runtime.onInstalled.trigger({
        reason: 'browser_update',
        previousVersion: '0.0.0'
      })

      sinon.assert.calledOnce(browserUpdated)
    })

    it('registers web request on before redirect event', async () => {
      await global.app.boot()

      const hook = sinon.spy()

      Container.resolve(Dispatcher)
        .touch('app.management.runtime.webRequest.beforeRedirected')
        .addHook(hook)

      browser.webRequest.onBeforeRedirect.trigger('message')

      sinon.assert.calledOnce(hook)
      sinon.assert.calledWith(hook, 'message')
    })

    it('registers web request on completed event', async () => {
      await global.app.boot()

      const hook = sinon.spy()

      Container.resolve(Dispatcher)
        .touch('app.management.runtime.webRequest.completed')
        .addHook(hook)

      browser.webRequest.onCompleted.trigger('message')

      sinon.assert.calledOnce(hook)
      sinon.assert.calledWith(hook, 'message')
    })

  })
}
