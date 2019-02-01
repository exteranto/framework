import { expect } from 'chai'
import { mock, instance, verify, deepEqual, anything } from 'ts-mockito'

import {
  Runtime,
  ExtensionInstalledEvent,
  ExtensionUpdatedEvent,
} from '@internal/runtime'

import { Container, Dispatcher } from '@exteranto/core'
import { NotImplementedException } from '@exteranto/exceptions'
import { Runtime as SafariRuntime } from '@internal/runtime/safari/Runtime'

export default ({ localStorage }) => {
  let runtime: Runtime
  let dispatcher: Dispatcher

  beforeEach(() => {
    dispatcher = mock(Dispatcher)
    runtime = new SafariRuntime
  })

  it('sets uninstall url', async () => {
    await expect(runtime.setUninstallUrl('https://test.com'))
      .to.eventually.be.rejectedWith(NotImplementedException)
  })

  it('registers install event', () => {
    Container.bindParam('app', { version: '1.0.0' })
    runtime.registerEvents(instance(dispatcher))

    expect(localStorage.getItem('@exteranto'))
      .to.equal('{"version":"1.0.0"}')

    verify(dispatcher.mail(deepEqual(new ExtensionInstalledEvent)))
      .once()
  })

  it('registers update event', () => {
    localStorage.setItem('@exteranto', '{"version":"1.0.0"}')
    Container.bindParam('app', { version: '1.0.1' })
    runtime.registerEvents(instance(dispatcher))

    expect(localStorage.getItem('@exteranto'))
      .to.equal('{"version":"1.0.1"}')

    verify(dispatcher.mail(deepEqual(new ExtensionUpdatedEvent('1.0.0'))))
      .once()
  })

  it('does not trigger update if versions match', () => {
    localStorage.setItem('@exteranto', '{"version":"1.0.0"}')
    Container.bindParam('app', { version: '1.0.0' })
    runtime.registerEvents(instance(dispatcher))

    verify(dispatcher.mail(anything()))
      .never()
  })
}
