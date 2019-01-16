import { expect } from 'chai'
import { Comb } from '../../src/Comb'
import { Browser } from '@exteranto/core'
import { Container } from '@exteranto/core'

describe('Comb Service', () => {

  before(() => {
    Container.bindParam('browser', Browser.TESTING)
  })

  it('only executes a callback on certain browser', async () => {
    await expect(new Comb().only([Browser.SAFARI], () => 'test'))
      .to.eventually.be.undefined

    await expect(new Comb()
      .only([Browser.TESTING], () => 'test')
      .then(r => r)
    ).to.eventually.equal('test')
  })

  it('only executes a callback on all other browsers', async () => {
    await expect(new Comb().except([Browser.TESTING], () => 'test'))
      .to.eventually.to.be.undefined

    await expect(new Comb().except([Browser.SAFARI], () => 'test'))
      .to.eventually.equal('test')
  })

  it('is able to chain this functionality', async () => {
    await expect(new Comb()
      .except([Browser.TESTING], () => 'test')
      .thenOnly([Browser.TESTING], () => 'test2')
    ).to.eventually.equal('test2')

    await expect(new Comb()
      .only([Browser.TESTING], () => 'test')
      .thenExcept([Browser.TESTING], () => 'test2')
    ).to.eventually.equal('test')
  })

  it('only returns last applicable result', async () => {
    await expect(new Comb()
      .only([Browser.TESTING], () => 'test')
      .thenOnly([Browser.TESTING, Browser.SAFARI], () => 'test2')
      .thenExcept([Browser.TESTING], () => 'test3')
    ).to.eventually.equal('test2')
  })

})
