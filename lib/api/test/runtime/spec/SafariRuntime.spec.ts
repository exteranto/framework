import * as sinon from 'sinon'
import { expect } from 'chai'
import { Container, Browser, Dispatcher } from '@exteranto/core'
import { NotImplementedException } from '@exteranto/exceptions'
import {
  Runtime,
  WebRequestCompletedEvent,
  WebRequestBeforeRedirectedEvent,
  ExtensionInstalledEvent,
  ExtensionUpdatedEvent,
} from '../../../src'

declare var global: any

export const tests = () => {
  describe('Safari', () => {
    let runtime
    let dispatcher

    before(() => {
      Container.bindParam('app', { version: '1.0.0' })

      Container.bindParam('browser', Browser.SAFARI)

      runtime = Container.resolve(Runtime)

      dispatcher = Container.resolve(Dispatcher)
    })

    beforeEach(() => {
      localStorage.clear()
    })

    it('sets uninstall url', () => {
      expect(runtime.setUninstallUrl('https://test.com'))
        .to.eventually.be.rejectedWith(NotImplementedException)
    })

    it('registers install event', (done) => {
      global.app.boot()

      expect(localStorage.getItem('@exteranto'))
        .to.equal('{"version":"1.0.0"}')

      Container.resolve(Dispatcher)
        .touch(ExtensionInstalledEvent)
        .addHook((_: ExtensionInstalledEvent) => done())
    })

    it('registers update event', async () => {
      localStorage.setItem('@exteranto', '{"version":"0.0.1"}')

      global.app.boot()

      const event: any = await new Promise((resolve) => {
        dispatcher
        .touch(ExtensionUpdatedEvent)
        .addHook((event: ExtensionUpdatedEvent) => resolve(event))
      })

      expect(event.previousVersion()).to.equal('0.0.1')
    })

    it('does not trigger update if versions match', async () => {
      localStorage.setItem('@exteranto', '{"version":"0.0.0"}')

      global.app.boot()

      const updated = sinon.spy()

      dispatcher
        .touch(ExtensionUpdatedEvent)
        .addHook((_: ExtensionUpdatedEvent) => updated())

      sinon.assert.notCalled(updated)
    })
  })
}
