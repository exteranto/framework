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
import { Runtime as ChromeRuntime } from '@internal/runtime/chrome/Runtime'

export default ({ chrome }) => {
  let runtime: Runtime
  let dispatcher: Dispatcher

  beforeEach(() => {
    dispatcher = mock(Dispatcher)
    runtime = new ChromeRuntime
  })

  it('sets uninstall url', async () => {
    chrome.runtime.setUninstallURL.yields('https://test.com')

    await runtime.setUninstallUrl('https://test.com')

    sinon.assert.calledOnce(chrome.runtime.setUninstallURL)
    sinon.assert.calledWith(chrome.runtime.setUninstallURL, 'https://test.com')
  })

  it('throws an exception if uninstall url is invalid', () => {
    chrome.runtime.setUninstallURL.yields(undefined)
    chrome.runtime.lastError = { message: 'Invalid url format' }

    return expect(runtime.setUninstallUrl('invalid'))
      .to.eventually.be.rejectedWith(InvalidUrlFormatException)
  })

  it('registers install event', () => {
    runtime.registerEvents(instance(dispatcher))

    chrome.runtime.onInstalled.trigger({
      reason: 'install'
    })

    verify(dispatcher.mail(deepEqual(new ExtensionInstalledEvent)))
      .once()
  })

  it('registers update event', () => {
    runtime.registerEvents(instance(dispatcher))

    chrome.runtime.onInstalled.trigger({
      reason: 'update',
      previousVersion: '0.0.0'
    })

    verify(dispatcher.mail(deepEqual(new ExtensionUpdatedEvent('0.0.0'))))
      .once()
  })

  it('registers web request on before redirect event', () => {
    runtime.registerEvents(instance(dispatcher))

    chrome.webRequest.onBeforeRedirect.trigger({
      tabId: 2
    })

    verify(dispatcher.fire(deepEqual(new WebRequestBeforeRedirectedEvent({ tabId: 2 }))))
      .once()
  })

  it('registers web request on completed event', () => {
    runtime.registerEvents(instance(dispatcher))

    chrome.webRequest.onCompleted.trigger({
      tabId: 2
    })

    verify(dispatcher.fire(deepEqual(new WebRequestCompletedEvent({ tabId: 2 }))))
      .once()
  })
}
