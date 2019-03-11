import { expect } from 'chai'
import * as sinon from 'sinon'
import { mock, instance, verify, deepEqual } from 'ts-mockito'

import { Dispatcher } from '@exteranto/core'
import { Storage, StorageChangedEvent, StorageType } from '@internal/storage'
import { LocalStorage as ChromeLocalStorage } from '@internal/storage/chrome/LocalStorage'

export default ({ chrome }) => {
  let storage: Storage
  let dispatcher: Dispatcher

  beforeEach(() => {
    dispatcher = mock(Dispatcher)
    storage = new ChromeLocalStorage
    ;(storage as any).dispatcher = instance(dispatcher)
  })

  it('populates a value', async () => {
    chrome.storage.local.get.yields({ another: 'pair' })
    chrome.storage.local.set.yields(undefined)

    await storage.populate('key', 'value')
    await storage.populate('another', 'lorem')

    sinon.assert.calledTwice(chrome.storage.local.get)
    sinon.assert.calledOnce(chrome.storage.local.set)
    sinon.assert.calledWith(chrome.storage.local.set, { key: 'value' })
  })

  it('stores a value', async () => {
    chrome.storage.local.set.yields(undefined)

    await storage.set('key', 'value')

    sinon.assert.calledOnce(chrome.storage.local.set)
    sinon.assert.calledWith(chrome.storage.local.set, { key: 'value' })
  })

  it('stores an object of values', async () => {
    chrome.storage.local.set.yields(null)

    await storage.set({ key: 'value' })

    sinon.assert.calledOnce(chrome.storage.local.set)
    sinon.assert.calledWith(chrome.storage.local.set, { key: 'value' })
  })

  it('collects a value', async () => {
    chrome.storage.local.get.yields({ key: 'value' })

    await expect(storage.get('key')).to.eventually.equal('value')
  })

  it('rejects a key that doesn\'t exist', async () => {
    chrome.storage.local.get.yields({ key: 'value' })

    await expect(storage.get('unknownKey')).to.eventually.be.rejected
  })

  it('collects an array of values', async () => {
    chrome.storage.local.get.yields({ key: 'value', another: 'pair' })

    await expect(storage.get(['key', 'another']))
      .to.eventually.deep.equal({ key: 'value', another: 'pair' })
  })

  it('collects all values', async () => {
    chrome.storage.local.get.yields({ key: 'value', another: 'pair' })

    await expect(storage.all())
      .to.eventually.deep.equal({ key: 'value', another: 'pair' })
  })

  it('removes a value or an arary of values', async () => {
    chrome.storage.local.remove.yields(undefined)

    await expect(storage.remove('key')).to.eventually.be.fulfilled

    sinon.assert.calledOnce(chrome.storage.local.remove)
    sinon.assert.calledWith(chrome.storage.local.remove, 'key')
  })

  it('clears the storage', async () => {
    chrome.storage.local.clear.yields(undefined)

    await expect(storage.clear()).to.eventually.be.fulfilled

    sinon.assert.calledOnce(chrome.storage.local.clear)
  })

  it('returns size in bytes', async () => {
    chrome.storage.local.getBytesInUse.yields(150)

    await expect(storage.size()).to.eventually.be.equal(150)
  })

  it('registers the correct listener', async () => {
    chrome.storage.local.set.yields(undefined)

    await storage.set('key', 'value')

    verify(dispatcher.fire(deepEqual(new StorageChangedEvent(StorageType.LOCAL, { key: 'value' }))))
      .once()
  })
}
