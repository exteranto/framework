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

      const spy = sinon.spy()
      const handle = payload => new Promise((resolve) => {
        spy(payload)
        resolve()
      })

      Container.resolve(Dispatcher)
        .touch('app.management.runtime.installed')
        .addHook(handle)

      browser.runtime.onInstalled.trigger({
        reason: 'install'
      })

      await handle

      sinon.assert.calledOnce(spy)
      sinon.assert.calledWith(spy, { reason: 'install' })
    })

    it('registers update event', async () => {
      await global.app.boot()

      const spy = sinon.spy()
      const handle = payload => new Promise((resolve) => {
        spy(payload)
        resolve()
      })

      Container.resolve(Dispatcher)
        .touch('app.management.runtime.updated')
        .addHook(handle)

      browser.runtime.onInstalled.trigger({
        reason: 'update',
        previousVersion: '0.0.0'
      })

      await handle

      sinon.assert.calledOnce(spy)
      sinon.assert.calledWith(spy, { reason: 'update', previousVersion: '0.0.0' })
    })

    it('registers browser update event', async () => {
      await global.app.boot()

      const spy = sinon.spy()
      const handle = payload => new Promise((resolve) => {
        spy(payload)
        resolve()
      })

      Container.resolve(Dispatcher)
        .touch('app.management.runtime.browser-updated')
        .addHook(handle)

      browser.runtime.onInstalled.trigger({
        reason: 'browser_update',
        previousVersion: '0.0.0'
      })

      await handle

      sinon.assert.calledOnce(spy)
      sinon.assert.calledWith(spy, { reason: 'browser_update', previousVersion: '0.0.0' })
    })

    it('registers web request on before redirect event', async () => {
      await global.app.boot()

      const spy = sinon.spy()
      const handle = payload => new Promise((resolve) => {
        spy(payload)
        resolve()
      })

      Container.resolve(Dispatcher)
        .touch('app.management.runtime.web-request.before-redirected')
        .addHook(handle)

      browser.webRequest.onBeforeRedirect.trigger('message')

      await handle

      sinon.assert.calledOnce(spy)
      sinon.assert.calledWith(spy, 'message')
    })

    it('registers web request on completed event', async () => {
      await global.app.boot()

      const spy = sinon.spy()
      const handle = payload => new Promise((resolve) => {
        spy(payload)
        resolve()
      })

      Container.resolve(Dispatcher)
        .touch('app.management.runtime.web-request.completed')
        .addHook(handle)

      browser.webRequest.onCompleted.trigger('message')

      await handle

      sinon.assert.calledOnce(spy)
      sinon.assert.calledWith(spy, 'message')
    })

  })
}
