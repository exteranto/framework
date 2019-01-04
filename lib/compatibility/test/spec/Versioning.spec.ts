import { expect } from 'chai'
import { VersionNotMatchedException } from '@exteranto/exceptions'
import { Container } from '@exteranto/ioc'
import { Browser } from '@exteranto/support'
import { Versioning } from '../../src/Versioning'

describe('Versioning Service', () => {
  let versioning

  before(() => {
    Container.bindParam('app', { version: '1.0.0' })

    versioning = Container.resolve(Versioning)
  })

  it('executes a callback since a certain version', async () => {
    await expect(versioning.since('1.0.0', () => 'test'))
      .to.eventually.be.fulfilled
      .and.equal('test')
  })

  it('rejects the method if version is higher while using `.since`', async () => {
    await expect(versioning.since('1.0.1', () => 'test'))
      .to.eventually.be.rejectedWith(VersionNotMatchedException)
        .that.has.property('name')
        .that.equals('app.exceptions.compatibility.versionNotMatched')
  })

  it('executes a callback until a certain version', async () => {
    await expect(versioning.until('1.0.0', () => 'test'))
      .to.eventually.be.fulfilled
      .and.equal('test')
  })

  it('rejects the method if version is lower while using `.until`', async () => {
    await expect(versioning.until('0.0.9', () => 'test'))
      .to.eventually.be.rejectedWith(VersionNotMatchedException)
        .that.has.property('name')
        .that.equals('app.exceptions.compatibility.versionNotMatched')
  })
})
