import { expect } from 'chai'
import * as sinon from 'sinon'
import { mock, instance, verify, deepEqual } from 'ts-mockito'

import {
  Runtime,
  ExtensionInstalledEvent,
  ExtensionUpdatedEvent,
  WebRequestBeforeRedirectedEvent,
  WebRequestCompletedEvent,
} from '@internal/runtime'

import { Dispatcher } from '@exteranto/core'
import { InvalidUrlFormatException } from '@exteranto/exceptions'
import { Runtime as ExtensionsRuntime } from '@internal/runtime/extensions/Runtime'

export default ({ browser }) => {
  let runtime: Runtime
  let dispatcher: Dispatcher

  beforeEach(() => {
    dispatcher = mock(Dispatcher)
    runtime = new ExtensionsRuntime
  })

  it('sets uninstall url', async () => {
    browser.runtime.setUninstallURL.resolves('https://test.com')

    await runtime.setUninstallUrl('https://test.com')

    sinon.assert.calledOnce(browser.runtime.setUninstallURL)
    sinon.assert.calledWith(browser.runtime.setUninstallURL, 'https://test.com')
  })

  it('throws an exception if uninstall url is invalid', async () => {
    browser.runtime.setUninstallURL.rejects()

    await expect(runtime.setUninstallUrl('invalid'))
      .to.eventually.be.rejectedWith(InvalidUrlFormatException)

    sinon.assert.calledOnce(browser.runtime.setUninstallURL)
  })


  it('registers install event', () => {
    runtime.registerEvents(instance(dispatcher))

    browser.runtime.onInstalled.trigger({
      reason: 'install'
    })

    verify(dispatcher.mail(deepEqual(new ExtensionInstalledEvent)))
      .once()
  })

  it('registers update event', () => {
    runtime.registerEvents(instance(dispatcher))

    browser.runtime.onInstalled.trigger({
      reason: 'update',
      previousVersion: '0.0.0'
    })

    verify(dispatcher.mail(deepEqual(new ExtensionUpdatedEvent('0.0.0'))))
      .once()
  })

  it('registers web request on before redirect event', () => {
    runtime.registerEvents(instance(dispatcher))

    browser.webRequest.onBeforeRedirect.trigger({
      tabId: 2
    })

    verify(dispatcher.fire(deepEqual(new WebRequestBeforeRedirectedEvent({ tabId: 2 }))))
      .once()
  })

  it('registers web request on completed event', () => {
    runtime.registerEvents(instance(dispatcher))

    browser.webRequest.onCompleted.trigger({
      tabId: 2
    })

    verify(dispatcher.fire(deepEqual(new WebRequestCompletedEvent({ tabId: 2 }))))
      .once()
  })
}
