/// <reference types="mocha" />

import { expect } from 'chai'
import { Optional, Some, None } from '../../../src'
import { OptionIsNoneException } from '@exteranto/exceptions'

describe('Optional Interface', () => {
  const some: Optional<number> = new Some(1)

  const none: Optional<number> = new None()

  it('inits a new instance', () => {
    expect(some.isSome()).to.be.ok
    expect(some.isNone()).to.be.false

    expect(none.isNone()).to.be.ok
    expect(none.isSome()).to.be.false
  })

  it('unwraps a value', () => {
    expect(some.unwrap()).to.be.equal(1)

    expect(() => none.unwrap()).to.throw(OptionIsNoneException)
  })

  it('filters the option', () => {
    expect(some.filter(it => it === 1).isSome()).to.be.ok
    expect(some.filter(it => it > 10).isNone()).to.be.ok

    expect(none.filter(it => true).isNone()).to.be.ok
  })

  it('maps the option', () => {
    expect(some
      .map(new None(), (t: number, u: any) => new Some(t + u))
      .isNone()
    ).to.be.ok
    expect(some
      .map(new Some(2), (t: number, u: any) => new Some(t + u))
      .unwrap()
    ).to.equal(3)

    expect(none
      .map(new Some(2), (t: number, u: any) => new Some(t + u))
      .isNone()
    ).to.be.ok
  })

  it('throws custom error with expect', () => {
    expect(some.expect(new Error('error'))).to.equal(1)

    expect(() => none.expect(new Error('error'))).to.throw(Error, 'error')
  })

  it('defaults to a value', () => {
    expect(some.unwrapOr(2)).to.equal(1)

    expect(none.unwrapOr(2)).to.equal(2)
  })

  it('defaults to a computed value', () => {
    expect(some.unwrapOrElse(() => 2)).to.equal(1)

    expect(none.unwrapOrElse(() => 2)).to.equal(2)
  })

  it('matches the correct callback', () => {
    expect(some.match(
      (some) => some + 1
    )).to.equal(2)

    expect(none.match(
      (some) => some + 1
    )).to.equal(undefined)
    expect(none.match(
      (some) => some + 1,
      () => 3
    )).to.equal(3)
  })
})
