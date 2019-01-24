import { expect } from 'chai'

import { VersionResolver } from '@internal/compatibility'

describe('VersionResolver', () => {
  let versionResolver

  beforeEach(() => {
    versionResolver = new VersionResolver()
  })

  it('compares a lower version', () => {
    expect(versionResolver.lower('1.0.0', '1.0.1')).to.be.true
    expect(versionResolver.lower('1.0.1', '1.0.0')).to.be.false
    expect(versionResolver.lower('1.0.0', '1.0.0')).to.be.false

    expect(versionResolver.lower('1.0.0', '1.1.1')).to.be.true
    expect(versionResolver.lower('1.1.1', '1.0.0')).to.be.false
    expect(versionResolver.lower('1.0.0', '1.0.0')).to.be.false

    expect(versionResolver.lower('1.0.0', '2.1.1')).to.be.true
    expect(versionResolver.lower('2.1.1', '1.0.0')).to.be.false
    expect(versionResolver.lower('1.0.0', '1.0.0')).to.be.false
  })

  it('compares a higher version', () => {
    expect(versionResolver.higher('1.0.0', '1.0.1')).to.be.false
    expect(versionResolver.higher('1.0.1', '1.0.0')).to.be.true
    expect(versionResolver.higher('1.0.0', '1.0.0')).to.be.false

    expect(versionResolver.higher('1.0.0', '1.1.1')).to.be.false
    expect(versionResolver.higher('1.1.1', '1.0.0')).to.be.true
    expect(versionResolver.higher('1.0.0', '1.0.0')).to.be.false

    expect(versionResolver.higher('1.0.0', '2.1.1')).to.be.false
    expect(versionResolver.higher('2.1.1', '1.0.0')).to.be.true
    expect(versionResolver.higher('1.0.0', '1.0.0')).to.be.false
  })

  it('compares an equal version', () => {
    expect(versionResolver.equal('1.0.0', '1.0.1')).to.be.false
    expect(versionResolver.equal('1.0.1', '1.0.0')).to.be.false
    expect(versionResolver.equal('1.0.0', '1.0.0')).to.be.true
  })
})
