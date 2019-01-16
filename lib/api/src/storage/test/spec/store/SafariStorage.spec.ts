import { assert, expect } from 'chai'
import { Container } from '@exteranto/ioc'
import { Browser } from '@exteranto/support'
import { Dispatcher } from '@exteranto/events'
import { StorageChangedEvent, Storage } from '../../../src'

export const tests = () => {
  describe('Safari', async () => {
    let local, sync

    before(() => {
      Container.bindParam('browser', Browser.SAFARI)

      local = Container.resolve(Storage, ['local'])
      sync = Container.resolve(Storage, ['sync'])
    })

    afterEach(() => {
      Container.resolve(Dispatcher).events = {}
    })

    it('populates a value', async () => {
      await local.set('another', 'pair')
      await local.populate('key', 'value')
      await local.populate('another', 'lorem')
      await assert.eventually.equal(local.get('another'), 'pair')
    })

    it('stores a value', async () => {
      await local.set('key', 'value')
      await assert.eventually.equal(local.get('key'), 'value')
    })

    it('stores an object of values', async () => {
      await local.set({ key: 'value', another: 'pair' });

      await assert.eventually.deepEqual(
        local.get(['key', 'another']),
        { key: 'value', another: 'pair' }
      )
    })

    it('collects a value', async () => {
      await local.set('key', 'value')
      await assert.eventually.equal(local.get('key'), 'value')
    })

    it('rejects a key that doesn\'t exist', async () => {
      await assert.isRejected(local.get('unknownKey'))
    })

    it('collects an array of values', async () => {
      await local.set({ key: 'value', another: 'pair' })
      await assert.eventually.deepEqual(
        local.get(['key', 'another']),
        { key: 'value', another: 'pair' })
    })

    it('collects all values', async () => {
      await local.set({ key: 'value', another: 'pair' })
      await sync.set({ test: 'lorem' })
      await assert.eventually.deepEqual(
        local.all(),
        { key: 'value', another: 'pair' })
    })

    it('removes a value or an arary of values', async () => {
      await local.set('key', 'value')
      await assert.isFulfilled(local.remove('key'))

      await local.set({ key: 'value', another: 'pair', test: 'lorem' })
      await assert.isFulfilled(local.remove(['test', 'key']))
      await assert.eventually.deepEqual(
        local.get(['key', 'another', 'test']),
        { another: 'pair' })
    })

    it('clears the storage', async () => {
      await local.set({ key: 'value' })
      await sync.set({ another: 'pair' })
      await assert.isFulfilled(local.clear())
      await assert.isRejected(local.get('key'))
      await assert.eventually.equal(sync.get('another'), 'pair')
    })

    it('returns size in bytes', async () => {
      await local.set('key', 'value')
      await sync.set('very_long_key', 'very long value stored')
      await expect(local.size()).to.eventually.equal(15)
      await expect(sync.size()).to.eventually.equal(42)
    })

    it('registers the correct listener', (done) => {
      Container.resolve(Dispatcher)
        .touch(StorageChangedEvent)
        .addHook((event: StorageChangedEvent) => {
          try {
            expect(event.getStorable()).to.deep.equal({ key: 'value' })
            expect(event.getType()).to.equal('local')
            done()
          } catch (e) { done(e) }
        })

      local.set('key', 'value')
    })
  })
}
