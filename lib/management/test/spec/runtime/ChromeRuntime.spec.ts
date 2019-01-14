import * as sinon from 'sinon'
import { expect } from 'chai'
import * as chrome from 'sinon-chrome'
import { Container } from '@exteranto/ioc'
import { Browser } from '@exteranto/support'
import { Dispatcher } from '@exteranto/events'
import { Runtime } from '../../../src/runtime/Runtime'
import { InvalidUrlFormatException } from '@exteranto/exceptions'

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

      const spy = sinon.spy()
      const handle = payload => new Promise((resolve) => {
        spy(payload)
        resolve()
      })

      Container.resolve(Dispatcher)
        .touch('app.management.runtime.installed')
        .addHook(handle)

      chrome.runtime.onInstalled.trigger({
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

      chrome.runtime.onInstalled.trigger({
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

      chrome.runtime.onInstalled.trigger({
        reason: 'chrome_update',
        previousVersion: '0.0.0'
      })

      await handle

      sinon.assert.calledOnce(spy)
      sinon.assert.calledWith(spy, { reason: 'chrome_update', previousVersion: '0.0.0' })
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

      chrome.webRequest.onBeforeRedirect.trigger('message')

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

      chrome.webRequest.onCompleted.trigger('message')

      await handle

      sinon.assert.calledOnce(spy)
      sinon.assert.calledWith(spy, 'message')
    })
  })
}
