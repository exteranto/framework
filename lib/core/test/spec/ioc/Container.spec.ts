import { expect } from 'chai'
import { Container } from '@internal/ioc'
import { Browser } from '@internal/support'
import { Some, None } from '@internal/structures'

describe('Container', () => {
  let container: Container

  beforeEach(() => {
    Container.reset()
    container = Container.getInstance()
    container.bindParam('browser', Browser.CHROME)
  })

  it('binds a simple dependency', () => {
    container.bind<ChildDependency>(ChildDependency).toSelf()

    expect(container.resolve<ChildDependency>(ChildDependency)).to.be.instanceof(ChildDependency)
  })

  it('binds a simple dependency with constructor args', () => {
    container.bind<ChildDependency>(ChildDependency).toSelf()

    expect(container.resolve<ChildDependency>(ChildDependency, ['arg']).type).to.equal('arg')
  })

  it('binds a singleton', () => {
    const dep = container.bind<ChildDependency>(ChildDependency).toSelf().asSingleton()
    const resolved = container.resolve<ChildDependency>(ChildDependency, ['arg'])

    expect(resolved.type).to.equal('arg')
    resolved.type = 'changed'
    expect(container.resolve<ChildDependency>(ChildDependency, ['another']).type).to.equal('changed')
  })

  it('binds a dependency to an abstract type', () => {
    container.bind<ChildDependency>(ChildDependency).to(Abstract)

    expect(container.resolve<Abstract>(Abstract)).to.be.instanceof(ChildDependency)
  })

  it('binds a dependency to an abstract type with a browser specified', () => {
    container.bind<ChromeDependency>(ChromeDependency).to(Abstract).for(Browser.CHROME)
    container.bind<ExtensionsDependency>(ExtensionsDependency).to(Abstract).for(Browser.EXTENSIONS)

    expect(container.resolve<Abstract>(Abstract)).to.be.instanceof(ChromeDependency)
      .and.not.be.instanceof(ExtensionsDependency)

    container.bindParam('browser', Browser.EXTENSIONS)

    expect(container.resolve<Abstract>(Abstract)).to.be.instanceof(ExtensionsDependency)
      .and.not.be.instanceof(ChromeDependency)
  })

  it('binds a simple parameter', () => {
    container.bindParam('param', 1)

    expect(container.resolveParam('param')).to.equal(1)
  })

  it('binds an object parameter', () => {
    container.bindParam('param', { test: 'test' })

    expect(container.resolveParam('param')).to.deep.equal({ test: 'test' })
  })

  it('resolves an object parameter using the dot notation', () => {
    container.bindParam('param', { test: 'test' })
    container.bindParam('param2', { test: { test: 'test' } })

    expect(container.resolveParam('param.test')).to.deep.equal('test')
    expect(container.resolveParam('param2.test.test')).to.deep.equal('test')
  })

  it('throws an exception if dependency was not found', () => {
    expect(() => container.resolve<Abstract>(Abstract))
      // TODO Change.
      .to.throw(Error)
  })

  it('throws an exception if param was not found', () => {
    expect(() => container.resolveParam('invalid'))
      // TODO Change.
      .to.throw(Error)
  })

  it('resolves a dependency as an optional', () => {
    expect(container.resolveOptional<Abstract>(Abstract))
      .to.be.an.instanceOf(None)

    container.bind<ChildDependency>(ChildDependency).to(Abstract)

    expect(container.resolveOptional<Abstract>(Abstract))
      .to.be.an.instanceOf(Some)
      .and.to.satisfy(o => o.unwrap() instanceof Abstract)
  })

  it('resolves a parameter as an optional', () => {
    expect(container.resolveOptional<Abstract>(Abstract))
      .to.be.an.instanceOf(None)

    container.bind<ChildDependency>(ChildDependency).to(Abstract)

    expect(container.resolveOptional<Abstract>(Abstract))
      .to.be.an.instanceOf(Some)
      .and.to.satisfy(o => o.unwrap() instanceof Abstract)
  })
})

abstract class Abstract {
  constructor (public type = 'test') {
    //
  }
}

class ChildDependency extends Abstract {
  //
}

class ChromeDependency extends Abstract {
  //
}

class ExtensionsDependency extends Abstract {
  //
}
