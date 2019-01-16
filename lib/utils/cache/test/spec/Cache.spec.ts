import { expect } from 'chai'
import { Cache } from '../../src/Cache'
import { Cached } from '../../src/Annotations'
import { Container } from '@exteranto/ioc'
import { Storage } from '@exteranto/storage'

describe('Cache Service', () => {
  let cache, store;

  before(() => {
    Container.bind(MemoryStorage).to(Storage).singleton(true)

    store = Container.resolve(Storage)
    cache = Container.resolve(Cache)
  })

  it('successfully stores a callback value in cache', async () => {
    await expect(cache.store('key1', () => 'value'))
      .to.eventually.equal('value')

    expect(store.data[cache.createHash('key1')].data).to.equal('value')
  })

  it('successfully resolves a value from cache', async () => {
    await cache.store('key2', () => 'value')

    await expect(cache.store('key2', () => 'value2'))
      .to.eventually.equal('value')
  })

  it('does not resolve an expired cache', async () => {
    await cache.store('key3', () => 'value', -1)

    await expect(cache.store('key3', () => 'value2'))
      .to.eventually.equal('value2')

    expect(store.data[cache.createHash('key3')].data).to.equal('value2')
  })

  it('correctly sets expiration timeout', async () => {
    const expected = Math.floor(Date.now() / 1000) + 10

    await cache.store('key4', () => 'value', 10)

    const actual = Math.floor(store.data[cache.createHash('key4')].expiresAt / 1000)

    expect(actual).to.equal(expected)
  })

  it('correctly sets expiration timeout from config', async () => {
    const expected = Math.floor(Date.now() / 1000) + 1

    await cache.store('key5', () => 'value')

    const actual = Math.floor(store.data[cache.createHash('key5')].expiresAt / 1000)

    expect(actual).to.equal(expected)
  })

  it('successfully clears all cache', async () => {
    await cache.clear()

    store.data.test = 'test'

    expect(Object.keys(store.data)).to.have.lengthOf(1)
    expect(store.data.test).to.equal('test')
  })

  it('works with annotations', async () => {
    await expect(new Annotated().cachedMethod()).to.eventually.equal('test')
  })

  it('works with annotations and custom timeout', async () => {
    await expect(new Annotated().cachedMethodWithTimeout()).to.eventually.equal('test with timeout')
  })
})

class MemoryStorage extends Storage {
  public data;

  async get (key) {
    this.data = this.data || {}

    if (this.data[key]) {
      return this.data[key]
    }

    throw new Error()
  }

  async set (key, value) {
    this.data = this.data || {}

    this.data[key] = value

    return value
  }

  async all () {
    return this.data
  }

  async remove (key) {
    delete this.data[key]
  }

  async size () {
    return 0
  }

  async clear () {

  }
}

class Annotated {

  @Cached()
  cachedMethod () {
    return 'test'
  }

  @Cached({ timeout: 120 })
  cachedMethodWithTimeout () {
    return 'test with timeout'
  }
}
