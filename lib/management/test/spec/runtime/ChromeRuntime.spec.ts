import * as sinon from 'sinon'
import { expect } from 'chai'
import * as chrome from 'sinon-chrome'
import { Container } from '@exteranto/ioc'
import { Browser } from '@exteranto/support'
import { Dispatcher } from '@exteranto/events'
import { Runtime } from '../../../src/runtime/Runtime'
import { InvalidUrlFormatException } from '@exteranto/exceptions'
import { safari } from '../../../../test/mocks/safari';

declare var global: any

export const tests = () => {
  describe('Chrome', () => {
    let runtime

    before(() => {
      Container.bindParam('browser', Browser.CHROME)

      runtime = Container.resolve(Runtime)
    })

    it('sets uninstall url', () => {
      (chrome.runtime as any).setUninstallURL.yields('https://test.com')

      runtime.setUninstallUrl('https://test.com')

      sinon.assert.calledOnce((chrome.runtime as any).setUninstallURL)
      sinon.assert.calledWith((chrome.runtime as any).setUninstallURL, 'https://test.com')
    })

    it('throws an exception if uninstall url is invalid', () => {
      (chrome.runtime as any).setUninstallURL.yields(undefined)
      chrome.runtime.lastError = { message: 'Invalid url format' }

      return expect(runtime.setUninstallUrl('invalid'))
        .to.eventually.be.rejectedWith(InvalidUrlFormatException)
    })

    it('converts relative path to url', async () => {
      chrome.runtime.getURL.returns('chrome://extension/abc/path')

      expect(runtime.extensionUrl('path'))
        .to.equal('chrome://extension/abc/path')
      expect(chrome.runtime.getURL.calledOnce).to.be.true
    })

    it('registers install event', async () => {
      await global.app.boot()

      const installed = sinon.spy()

      Container.resolve(Dispatcher)
        .touch('app.management.runtime.installed')
        .addHook(installed)

      chrome.runtime.onInstalled.trigger({
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

      chrome.runtime.onInstalled.trigger({
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

      chrome.runtime.onInstalled.trigger({
        reason: 'chrome_update',
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

      chrome.webRequest.onBeforeRedirect.trigger('message')

      sinon.assert.calledOnce(hook)
      sinon.assert.calledWith(hook, 'message')
    })

    it('registers web request on completed event', async () => {
      await global.app.boot()

      const hook = sinon.spy()

      Container.resolve(Dispatcher)
        .touch('app.management.runtime.webRequest.completed')
        .addHook(hook)

      chrome.webRequest.onCompleted.trigger('message')

      sinon.assert.calledOnce(hook)
      sinon.assert.calledWith(hook, 'message')
    })
  })
}
