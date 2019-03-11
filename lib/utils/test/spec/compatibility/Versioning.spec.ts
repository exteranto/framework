import { expect } from 'chai'

import { Container } from '@exteranto/core'
import { Versioning } from '@internal/compatibility'
import { VersionNotMatchedException } from '@internal/compatibility/exceptions'

describe('Versioning', () => {
  let versioning: Versioning

  beforeEach(() => {
    Container.getInstance().bindParam('app', { version: '1.0.0' })

    versioning = new Versioning
  })

  it('executes a callback since a certain version', async () => {
    await expect(versioning.since('1.0.0', () => 'test'))
      .to.eventually.be.fulfilled
      .and.equal('test')
  })

  it('rejects the method if version is higher while using `.since`', async () => {
    await expect(versioning.since('1.0.1', () => 'test'))
      .to.eventually.be.rejectedWith(VersionNotMatchedException)
  })

  it('executes a callback until a certain version', async () => {
    await expect(versioning.until('1.0.0', () => 'test'))
      .to.eventually.be.fulfilled
      .and.equal('test')
  })

  it('rejects the method if version is lower while using `.until`', async () => {
    await expect(versioning.until('0.0.9', () => 'test'))
      .to.eventually.be.rejectedWith(VersionNotMatchedException)
  })
})
