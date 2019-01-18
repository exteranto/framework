import * as sinon from 'sinon'
import { assert, expect } from 'chai'
import * as chrome from 'sinon-chrome'
import { Container } from '@exteranto/core'
import { Browser } from '@exteranto/core'
import { Dispatcher } from '@exteranto/core'
import { StorageChangedEvent, Storage } from '../../../src'

export const tests = () => {
  describe('Chrome', () => {
    let storage

    before(() => {
      Container.bindParam('browser', Browser.CHROME)

      storage = Container.resolve(Storage, ['local'])
    })

    afterEach(() => {
      Container.resolve(Dispatcher).events = {}
    })

    it('populates a value', async () => {
      chrome.storage.local.get.yields({ another: 'pair' })
      chrome.storage.local.set.yields(null)

      await storage.populate('key', 'value')
      await storage.populate('another', 'lorem')

      sinon.assert.calledTwice(chrome.storage.local.get)
      sinon.assert.calledOnce(chrome.storage.local.set)
      sinon.assert.calledWith(chrome.storage.local.set, { key: 'value' })
    })

    it('stores a value', async () => {
      chrome.storage.local.set.yields(null)

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
      await assert.eventually.equal(storage.get('key'), 'value')
    })

    it('rejects a key that doesn\'t exist', async () => {
      chrome.storage.local.get.yields({ key: 'value' })
      await assert.isRejected(storage.get('unknownKey'))
    })

    it('collects an array of values', async () => {
      chrome.storage.local.get.yields({ key: 'value', another: 'pair' })
      await assert.eventually.deepEqual(
        storage.get(['key', 'another']),
        { key: 'value', another: 'pair' })
    })

    it('collects all values', async () => {
      chrome.storage.local.get.yields({ key: 'value', another: 'pair' })
      await assert.eventually.deepEqual(
        storage.all(),
        { key: 'value', another: 'pair' })
    })

    it('removes a value or an arary of values', async () => {
      chrome.storage.local.remove.yields(undefined)
      await assert.isFulfilled(storage.remove('key'))
    })

    it('clears the storage', async () => {
      chrome.storage.local.clear.yields(undefined)
      await assert.isFulfilled(storage.clear())
    })

    it('returns size in bytes', async () => {
      chrome.storage.local.getBytesInUse.yields(150)
      await assert.eventually.equal(storage.size(), 150)

      chrome.storage.local.getBytesInUse.yields(50)
      await assert.eventually.equal(storage.size('value'), 50)
    })

    it('registers the correct listener', (done) => {
      chrome.storage.local.set.yields(null)

      Container.resolve(Dispatcher)
        .touch(StorageChangedEvent)
        .addHook((event: StorageChangedEvent) => {
          try {
            expect(event.getStorable()).to.deep.equal({ key: 'value' })
            expect(event.getType()).to.equal('local')
            done()
          } catch (e) { done(e) }
        })

      storage.set('key', 'value')
    })
  })
}
