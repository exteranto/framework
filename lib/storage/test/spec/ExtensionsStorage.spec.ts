import { assert, expect } from 'chai'
import * as sinon from 'sinon'
import { Container } from '@exteranto/ioc'
import { Storage } from '../../src/Storage'
import * as browser from 'sinon-chrome/extensions'
import { Browser } from '@exteranto/support'

describe('Storage API for Extensions', () => {
  let storage

  before(() => {
    Container.bindParam('browser', Browser.EXTENSIONS)

    storage = Container.resolve(Storage, ['local'])
  })

  it('populates a value', async () => {
    browser.storage.local.get.yields({ another: 'pair' })
    browser.storage.local.set.yields(null)

    await storage.populate('key', 'value')
    await storage.populate('another', 'lorem')

    sinon.assert.calledTwice(browser.storage.local.get)
    sinon.assert.calledOnce(browser.storage.local.set)
    sinon.assert.calledWith(browser.storage.local.set, { key: 'value' })
  })

  it('stores a value', async () => {
    browser.storage.local.set.yields(null)

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
    await assert.eventually.equal(storage.get('key'), 'value')
  })

  it('rejects a key that doesn\'t exist', async () => {
    browser.storage.local.get.yields({ key: 'value' })
    await assert.isRejected(storage.get('unknownKey'))
  })

  it('collects an array of values', async () => {
    browser.storage.local.get.yields({ key: 'value', another: 'pair' })
    await assert.eventually.deepEqual(
      storage.get(['key', 'another']),
      { key: 'value', another: 'pair' })
  })

  it('collects all values', async () => {
    browser.storage.local.get.yields({ key: 'value', another: 'pair' })
    await assert.eventually.deepEqual(
      storage.all(),
      { key: 'value', another: 'pair' })
  })

  it('removes a value or an arary of values', async () => {
    browser.storage.local.remove.yields(undefined)
    await assert.isFulfilled(storage.remove('key'))
  })

  it('clears the storage', async () => {
    browser.storage.local.clear.yields(undefined)
    await assert.isFulfilled(storage.clear())
  })

  it('returns size in bytes', async () => {
    browser.storage.local.getBytesInUse.yields(150)
    await assert.eventually.equal(storage.size(), 150)

    browser.storage.local.getBytesInUse.yields(50)
    await assert.eventually.equal(storage.size('value'), 50)
  })
})
