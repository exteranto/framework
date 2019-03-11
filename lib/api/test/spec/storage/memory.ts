import { expect } from 'chai'
import * as sinon from 'sinon'
import { mock, instance, verify, deepEqual } from 'ts-mockito'

import { Dispatcher } from '@exteranto/core'
import { Storage, StorageChangedEvent, StorageType, StorageKeyNotFoundException } from '@internal/storage'
import { MemoryStorage } from '@internal/storage/MemoryStorage'

export default () => {
  let storage: Storage
  let dispatcher: Dispatcher

  beforeEach(() => {
    dispatcher = mock(Dispatcher)
    storage = new MemoryStorage
    ;(storage as any).dispatcher = instance(dispatcher)
    storage.clear()
  })

  it('populates a value', async () => {
    ;(storage as any).data = { another: 'pair' }

    await storage.populate('key', 'value')
    await storage.populate('another', 'lorem')

    expect(storage.all()).to.eventually.deep.equal({
      key: 'value',
      another: 'pair'
    })
  })

  it('stores a value', async () => {
    await storage.set('key', 'value')

    expect(storage.all()).to.eventually.deep.equal({
      key: 'value'
    })
  })

  it('stores an object of values', async () => {
    await storage.set({ key: 'value' })

    expect(storage.all()).to.eventually.deep.equal({
      key: 'value'
    })
  })

  it('collects a value', async () => {
    ;(storage as any).data = { key: 'value' }

    await expect(storage.get('key')).to.eventually.equal('value')
  })

  it('rejects a key that doesn\'t exist', async () => {
    await expect(storage.get('unknownKey')).to.eventually.be.rejectedWith(StorageKeyNotFoundException)
  })

  it('collects an array of values', async () => {
    ;(storage as any).data = { key: 'value', another: 'pair' }

    await expect(storage.get(['key', 'another']))
      .to.eventually.deep.equal({ key: 'value', another: 'pair' })
  })

  it('collects all values', async () => {
    ;(storage as any).data = { key: 'value', another: 'pair' }

    await expect(storage.all())
      .to.eventually.deep.equal({ key: 'value', another: 'pair' })
  })

  it('removes a value or an arary of values', async () => {
    ;(storage as any).data = { key: 'value', another: 'pair' }

    await storage.remove('key')

    await expect(storage.all())
      .to.eventually.deep.equal({ another: 'pair' })
  })

  it('clears the storage', async () => {
    ;(storage as any).data = { key: 'value', another: 'pair' }

    await storage.clear()

    await expect(storage.all())
      .to.eventually.deep.equal({})
  })

  it('returns size in bytes', async () => {
    ;(storage as any).data = { key: 'value', another: 'pair' }

    await expect(storage.size()).to.eventually.equal(32)
  })

  it('registers the correct listener', async () => {
    await storage.set('key', 'value')

    verify(dispatcher.fire(deepEqual(new StorageChangedEvent(StorageType.MEMORY, { key: 'value' }))))
      .once()
  })
}
