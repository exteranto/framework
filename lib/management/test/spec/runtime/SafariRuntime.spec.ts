import * as sinon from 'sinon'
import { expect } from 'chai'
import { Container } from '@exteranto/ioc'
import { Browser } from '@exteranto/support'
import { Dispatcher } from '@exteranto/events'
import { Runtime } from '../../../src/runtime/Runtime'
import { NotImplementedException } from '@exteranto/exceptions'

declare var global: any

export const tests = () => {
  describe('Safari', () => {
    let runtime

    before(() => {
      Container.bindParam('app', { version: '1.0.0' })

      Container.bindParam('browser', Browser.SAFARI)

      runtime = Container.resolve(Runtime)
    })

    beforeEach(() => {
      localStorage.clear()
    })

    it('sets uninstall url', () => {
      expect(runtime.setUninstallUrl('https://test.com'))
        .to.eventually.be.rejectedWith(NotImplementedException)
    })

    it('converts relative path to url', async () => {
      expect(runtime.extensionUrl('path'))
        .to.equal('safari-extension://abc/path')
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

      await handle

      sinon.assert.calledOnce(spy)

      expect(localStorage.getItem('@exteranto'))
        .to.equal('{"version":"1.0.0"}')
    })

    it('registers update event', async () => {
      localStorage.setItem('@exteranto', '{"version":"0.0.1"}')

      await global.app.boot()

      const spy = sinon.spy()
      const handle = payload => new Promise((resolve) => {
        spy(payload)
        resolve()
      })

      Container.resolve(Dispatcher)
        .touch('app.management.runtime.updated')
        .addHook(handle)

      await handle

      sinon.assert.calledOnce(spy)
    })

    it('does not trigger update if versions match', async () => {
      localStorage.setItem('@exteranto', '{"version":"0.0.0"}')

      await global.app.boot()

      const updated = sinon.spy()

      Container.resolve(Dispatcher)
        .touch('app.management.runtime.updated')
        .addHook(updated)

      sinon.assert.notCalled(updated)
    })
  })
}
