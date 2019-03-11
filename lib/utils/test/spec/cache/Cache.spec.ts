import { expect } from 'chai'
import * as sinon from 'sinon'
import { mock, instance, verify, deepEqual, when, anything } from 'ts-mockito'

import { Storage } from '@exteranto/api'
import { Cache, Cached } from '@internal/cache'
import { Container, Browser } from '@exteranto/core'

describe('Cache', () => {
  let cache: Cache
  let storage: Storage
  let hasher

  beforeEach(() => {
    Container.getInstance().bindParam('browser', Browser.TESTING)

    storage = mock(StorageImplementation)
    cache = new Cache
    hasher = { init: sinon.stub().returnsArg(0) }

    ;(cache as any).driver = instance(storage)
    ;(cache as any).hasher = hasher
    ;(cache as any).config = { driver: 'local', timeout: 1 }
  })

  it('successfully stores a callback value in cache', async () => {
    Date.now = sinon.stub().returns(0)
    when(storage.get('cache__key'))
      .thenReject(null)
      .thenResolve({ expiresAt: 1000, data: 'value' })
    when(storage.set('cache__key', deepEqual({ expiresAt: 1000, data: 'value' })))
      .thenResolve(null)

    await expect(cache.store('key', () => 'value'))
      .to.eventually.equal('value')

    verify(storage.get('cache__key')).twice()
    verify(storage.set('cache__key', deepEqual({ expiresAt: 1000, data: 'value' }))).once()

    sinon.assert.calledOnce(hasher.init)
    sinon.assert.calledWith(hasher.init, 'key')
  })

  it('successfully resolves a value from cache', async () => {
    Date.now = sinon.stub().returns(0)
    when(storage.get('cache__key')).thenResolve({ expiresAt: 1000, data: 'value' })

    await expect(cache.store('key', () => 'value'))
      .to.eventually.equal('value')

    verify(storage.get('cache__key')).once()

    sinon.assert.calledOnce(hasher.init)
    sinon.assert.calledWith(hasher.init, 'key')
  })

  it('does not resolve an expired cache', async () => {
    Date.now = sinon.stub().returns(0)
    when(storage.get('cache__key'))
      .thenResolve({ expiresAt: -1, data: 'value' })
      .thenResolve({ expiresAt: 1000, data: 'value' })
    when(storage.set('cache__key', deepEqual({ expiresAt: 1000, data: 'value' })))
      .thenResolve(null)

    await expect(cache.store('key', () => 'value'))
      .to.eventually.equal('value')

    verify(storage.get('cache__key')).twice()
    verify(storage.set('cache__key', deepEqual({ expiresAt: 1000, data: 'value' }))).once()

    sinon.assert.calledOnce(hasher.init)
    sinon.assert.calledWith(hasher.init, 'key')
  })

  it('successfully clears all cache', async () => {
    when(storage.all()).thenResolve({ cache__key: 'value', not_cache: 'value' })

    await cache.clear()

    verify(storage.all()).once()
    verify(storage.remove(anything())).once()
  })

  it('works with annotations', async () => {
    Date.now = sinon.stub().returns(0)
    when(storage.get('cache__9fb121587fb7b77f31b38207c971409a')).thenResolve({ expiresAt: 1000, data: 'value' })

    await expect(new Annotated().cachedMethod()).to.eventually.equal('value')

    verify(storage.get('cache__9fb121587fb7b77f31b38207c971409a')).once()
  })
})

class StorageImplementation extends Storage {
  async get<T> () { return {} as T}
  async set () {}
  async all () {}
  async remove () {}
  async size () { return 0 }
  async clear () {}
}

class Annotated {

  @Cached()
  cachedMethod () {
    return 'value'
  }
}
