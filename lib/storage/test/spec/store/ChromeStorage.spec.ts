import { assert } from 'chai'
import * as sinon from 'sinon'
import * as chrome from 'sinon-chrome'
import { Container } from '@exteranto/ioc'
import { Storage } from '../../../src/Storage'
import { Browser } from '@exteranto/support'

export const tests = () => {
  describe('Chrome', () => {
    let storage

    before(() => {
      Container.bindParam('browser', Browser.CHROME)

      storage = Container.resolve(Storage, ['local'])
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
  })
}
