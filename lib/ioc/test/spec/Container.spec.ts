import { expect } from 'chai'
import { Container } from '../../src/Container'
import { Script, Browser } from '@exteranto/support'

describe('IOC Container', () => {

  beforeEach(() => {
    Container.reset()
  })

  it('should bind a simple dependency', () => {
    Container.bind(ChildDependency).toSelf()

    expect(Container.resolve(ChildDependency)).to.be.instanceof(ChildDependency)
  })

  it('should bind a simple dependency with constructor args', () => {
    Container.bind(ChildDependency).toSelf()

    expect(Container.resolve(ChildDependency, ['arg']).type).to.equal('arg')
  })

  it('should bind a singleton', () => {
    const dep = Container.bind(ChildDependency).toSelf().singleton(true)
    const resolved = Container.resolve(ChildDependency, ['arg'])

    expect(resolved.type).to.equal('arg')
    resolved.type = 'changed'
    expect(Container.resolve(ChildDependency, ['another']).type).to.equal('changed')
  })

  it('should bind a dependency to an abstract type', () => {
    Container.bind(ChildDependency).to(Abstract)

    expect(Container.resolve(Abstract)).to.be.instanceof(ChildDependency)
  })

  it('should bind a dependency to an abstract type with a browser specified', () => {
    Container.bindParam('browser', Browser.CHROME)
    Container.bind(ChromeDependency).to(Abstract).for(Browser.CHROME)
    Container.bind(ExtensionsDependency).to(Abstract).for(Browser.EXTENSIONS)

    expect(Container.resolve(Abstract)).to.be.instanceof(ChromeDependency)
      .and.not.be.instanceof(ExtensionsDependency)

    Container.bindParam('browser', Browser.EXTENSIONS)

    expect(Container.resolve(Abstract)).to.be.instanceof(ExtensionsDependency)
      .and.not.be.instanceof(ChromeDependency)
  })

  it('should bind a simple parameter', () => {
    Container.bindParam('param', 1)

    expect(Container.resolveParam('param')).to.equal(1)
  })

  it('should bind an object parameter', () => {
    Container.bindParam('param', { test: 'test' })

    expect(Container.resolveParam('param')).to.deep.equal({ test: 'test' })
  })

  it('should resolve an object parameter using the dot notation', () => {
    Container.bindParam('param', { test: 'test' })
    Container.bindParam('param2', { test: { test: 'test' } })

    expect(Container.resolveParam('param.test')).to.deep.equal('test')
    expect(Container.resolveParam('param2.test.test')).to.deep.equal('test')
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

