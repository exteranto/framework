import { expect } from 'chai'
import { Container } from '@exteranto/ioc'
import { Browser } from '@exteranto/support'
import { Versioning } from '../../src/Versioning'

describe('Versioning Service', () => {
  let versioning

  before(() => {
    Container.bindParam('app', { version: '1.0.0' })

    versioning = Container.resolve(Versioning)
  })

  it('only executes a callback since a certain version', (done) => {
    versioning.since('1.0.1', () => {
      done(new Error('should not have been executed'))
    })

    versioning.since('1.0.0', () => {
      done()
    })
  })

  it('only executes a callback until a certain version', (done) => {
    versioning.until('0.0.9', () => {
      done(new Error('should not have been executed'))
    })

    versioning.until('1.0.0', () => {
      done()
    })
  })

})
