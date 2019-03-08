import { expect } from 'chai'
import * as sinon from 'sinon'
import { mock, instance, verify, deepEqual } from 'ts-mockito'

import { Dispatcher } from '@exteranto/core'
import { Storage, StorageChangedEvent } from '@internal/storage'
import { Storage as ExtensionsStorage } from '@internal/storage/extensions/Storage'

export default ({ browser }) => {
  let storage: Storage
  let dispatcher: Dispatcher

  beforeEach(() => {
    dispatcher = mock(Dispatcher)
    storage = new ExtensionsStorage('local')
    ;(storage as any).dispatcher = instance(dispatcher)
  })

  it('populates a value', async () => {
    browser.storage.local.get.yields({ another: 'pair' })
    browser.storage.local.set.yields(undefined)

    await storage.populate('key', 'value')
    await storage.populate('another', 'lorem')

    sinon.assert.calledTwice(browser.storage.local.get)
    sinon.assert.calledOnce(browser.storage.local.set)
    sinon.assert.calledWith(browser.storage.local.set, { key: 'value' })
  })

  it('stores a value', async () => {
    browser.storage.local.set.yields(undefined)

    await storage.set('key', 'value')

    sinon.assert.calledOnce(browser.storage.local.set)
    sinon.assert.calledWith(browser.storage.local.set, { key: 'value' })
  })

  it('stores an object of values', async () => {
    browser.storage.local.set.yields(null)

    await storage.set({ key: 'value' })

    sinon.assert.calledOnce(browser.storage.local.set)
    sinon.assert.calledWith(browser.storage.local.set, { key: 'value' })
  })

  it('collects a value', async () => {
    browser.storage.local.get.yields({ key: 'value' })

    await expect(storage.get('key')).to.eventually.equal('value')
  })

  it('rejects a key that doesn\'t exist', async () => {
    browser.storage.local.get.yields({ key: 'value' })

    await expect(storage.get('unknownKey')).to.eventually.be.rejected
  })

  it('collects an array of values', async () => {
    browser.storage.local.get.yields({ key: 'value', another: 'pair' })

    await expect(storage.get(['key', 'another']))
      .to.eventually.deep.equal({ key: 'value', another: 'pair' })
  })

  it('collects all values', async () => {
    browser.storage.local.get.yields({ key: 'value', another: 'pair' })

    await expect(storage.all())
      .to.eventually.deep.equal({ key: 'value', another: 'pair' })
  })

  it('removes a value or an arary of values', async () => {
    browser.storage.local.remove.yields(undefined)

    await expect(storage.remove('key')).to.eventually.be.fulfilled

    sinon.assert.calledOnce(browser.storage.local.remove)
    sinon.assert.calledWith(browser.storage.local.remove, 'key')
  })

  it('clears the storage', async () => {
    browser.storage.local.clear.yields(undefined)

    await expect(storage.clear()).to.eventually.be.fulfilled

    sinon.assert.calledOnce(browser.storage.local.clear)
  })

  it('returns size in bytes', async () => {
    browser.storage.local.getBytesInUse.yields(150)

    await expect(storage.size()).to.eventually.be.equal(150)
  })

  it('registers the correct listener', async () => {
    browser.storage.local.set.yields(undefined)

    await storage.set('key', 'value')

    verify(dispatcher.fire(deepEqual(new StorageChangedEvent('local', { key: 'value' }))))
      .once()
  })
}
