import { expect } from 'chai'

describe('Typed', () => {

  it('test', () => {

    Container.bind<TestI>(TestI).to(Test)

    expect(Container.resolve<Test>(Test)).to.be.an.instanceOf(Test)

  })

})

// priority or tags or both
// optional
// @Container

class Container {

  static dependencies: Dependency<any, any>[] = []

  static bind<C> (concrete: Class<C>) : Dependency<any, C> {
    const d: Dependency<any, C> = new Dependency(concrete)

    this.dependencies.push(d)

    return d
  }

  static resolve<A> (abstract: Abstract<A>) : A {
    const i: A = this.dependencies.find(d => d.isSuitable(abstract)).resolve()

    return i
  }
}

class Dependency<A, C extends A> {

  private abstract: Abstract<A>

  constructor (private concrete: Class<C>) {
    this.abstract = this.concrete
  }

  to (abstract: Abstract<A>) {
    this.abstract = abstract
  }

  isSuitable (abstract: Abstract<A>) {
    return abstract === this.abstract
  }

  resolve () : C {
    return new this.concrete()
  }
}

// type Constructor<T> = new (...args: any[]) => T
type Class<T> = new (...args: any[]) => T
type Abstract<T> = Function & { prototype: T }

abstract class Test {

}

class TestI extends Test {

}

class Asd {

}
