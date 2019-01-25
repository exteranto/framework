import { expect } from 'chai'
import { mock, instance, verify, deepEqual } from 'ts-mockito'

import { Dispatcher } from '@exteranto/core'
import { Storage, StorageChangedEvent } from '@internal/storage'
import { Storage as SafariStorage } from '@internal/storage/safari/Storage'

export default ({ localStorage }) => {
  let local: Storage
  let sync: Storage
  let dispatcher: Dispatcher

  beforeEach(() => {
    dispatcher = mock(Dispatcher)
    local = new SafariStorage('local')
    sync = new SafariStorage('sync')
  })

  afterEach(async () => {
    localStorage.items = {}
  })

  it('populates a value', async () => {
    await local.set('another', 'pair')
    await local.populate('key', 'value')
    await local.populate('another', 'lorem')

    await expect(local.get('another')).to.eventually.equal('pair')
  })

  it('stores a value', async () => {
    await local.set('key', 'value')

    await expect(local.get('key')).to.eventually.equal('value')
  })

  it('stores an object of values', async () => {
    await local.set({ key: 'value', another: 'pair' });

    await expect(local.get(['key', 'another']))
      .to.eventually.deep.equal({ key: 'value', another: 'pair' })
  })

  it('collects a value', async () => {
    await local.set('key', 'value')

    await expect(local.get('key')).to.eventually.equal('value')
  })

  it('rejects a key that doesn\'t exist', async () => {
    await expect(local.get('unknownKey')).to.eventually.be.rejected
  })

  it('collects an array of values', async () => {
    await local.set({ key: 'value', another: 'pair' })

    await expect(local.get(['key', 'another']))
      .to.eventually.deep.equal({ key: 'value', another: 'pair' })
  })

  it('collects all values', async () => {
    await local.set({ key: 'value', another: 'pair' })
    await sync.set({ test: 'lorem' })

    await expect(local.all())
      .to.eventually.deep.equal({ key: 'value', another: 'pair' })
  })

  it('removes a value or an array of values', async () => {
    await local.set('key', 'value')

    await expect(local.remove('key')).to.eventually.be.fulfilled

    await local.set({ key: 'value', another: 'pair', test: 'lorem' })

    await expect(local.remove(['test', 'key'])).to.eventually.be.fulfilled
    await expect(local.all())
      .to.eventually.deep.equal({ another: 'pair' })
  })

  it('clears the storage', async () => {
    await local.set({ key: 'value' })
    await sync.set({ another: 'pair' })

    await expect(local.clear()).to.eventually.be.fulfilled
    await expect(local.get('key')).to.eventually.be.rejected
    await expect(sync.get('another')).to.eventually.equal('pair')
  })

  it('returns size in bytes', async () => {
    await local.set('key', 'value')
    await sync.set('very_long_key', 'very long value stored')

    await expect(local.size())
      .to.eventually.equal(JSON.stringify({ key: 'value' }).length)
    await expect(sync.size())
      .to.eventually.equal(JSON.stringify({ very_long_key: 'very long value stored' }).length)
  })

  it('registers the correct listener', async () => {
    (local as any).dispatcher = instance(dispatcher)

    await local.set('key', 'value')

    verify(dispatcher.fire(deepEqual(new StorageChangedEvent('local', { key: 'value' }))))
      .once()
  })
}
