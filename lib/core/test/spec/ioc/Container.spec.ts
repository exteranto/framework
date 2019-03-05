import { expect } from 'chai'

import {
  Self,
  With,
  Inject,
  Tagged,
  Autowired,
  Container,
  Optionally,
  ParameterNotFoundException,
  DependencyNotFoundException,
  MoreDependenciesMatchedException,
} from '@internal/ioc'

import { Browser } from '@internal/support'
import { Optional, Some, None } from '@bausano/data-structures'

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

  it('binds a simple dependency with constructor args as params', () => {
    container.bindParam('test', 'arg')
    container.bind<ChildDependency>(ChildDependency).toSelf()

    expect(container.resolve<ChildDependency>(ChildDependency, ['%test%']).type).to.equal('arg')
  })

  it('binds a simple dependency with constructor args that are not string', () => {
    container.bind<ChildDependency>(ChildDependency).toSelf()

    expect(container.resolve<ChildDependency>(ChildDependency, [false]).type).to.equal(false)
  })

  it('binds a singleton', () => {
    container.bind<ChildDependency>(ChildDependency).toSelf().asSingleton()
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

    expect(container.resolve<Abstract>(Abstract))
      .to.be.instanceof(ExtensionsDependency)
      .and.not.be.instanceof(ChromeDependency)
  })

  it('does not resolve a dependency with mismatching tags', () => {
    container.bind<ChildDependency>(ChildDependency).to(Abstract)

    expect(() => container.resolve<Abstract>(Abstract, [], { test: 'tag' }))
      .to.throw(DependencyNotFoundException)
  })

  it('resolves a dependency with matching tags', () => {
    container.bind<ChildDependency>(ChildDependency).to(Abstract).tag('test', 'tag')

    expect(container.resolve<Abstract>(Abstract, [], { test: 'tag' }))
      .to.be.instanceof(ChildDependency)
  })

  it('resolves a dependency with extra tags', () => {
    container.bind<ChildDependency>(ChildDependency).to(Abstract)
      .tag('test', 'tag')
      .tag('another', 'tag')

    expect(container.resolve<Abstract>(Abstract, [], { test: 'tag' }))
      .to.be.instanceof(ChildDependency)
  })

  it('chooses the correct dependency based on tags', () => {
    container.bind<ExtensionsDependency>(ExtensionsDependency).to(Abstract)
      .tag('type', 'extensions')
    container.bind<ChromeDependency>(ChromeDependency).to(Abstract)
      .tag('type', 'chrome')

    expect(container.resolve<Abstract>(Abstract, [], { type: 'extensions' }))
      .to.be.instanceof(ExtensionsDependency)
      .and.not.be.instanceof(ChromeDependency)
  })

  it('chooses the correct dependency based on tags as params', () => {
    container.bind<ChromeDependency>(ChromeDependency).to(Abstract)
      .tag('type', 'chrome')
    container.bind<ExtensionsDependency>(ExtensionsDependency).to(Abstract)
      .tag('type', 'extensions')

    expect(container.resolve<Abstract>(Abstract, [], { type: '%browser%' }))
      .to.be.instanceof(ChromeDependency)
      .and.not.be.instanceof(ExtensionsDependency)
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
      .to.throw(DependencyNotFoundException)
  })

  it('throws an exception if param was not found', () => {
    expect(() => container.resolveParam('invalid'))
      .to.throw(ParameterNotFoundException)
  })

  it('thrrows an exception if more dependencies matched', () => {
    container.bind<ExtensionsDependency>(ExtensionsDependency).to(Abstract)
    container.bind<ChromeDependency>(ChromeDependency).to(Abstract)

    expect(() => container.resolve<Abstract>(Abstract))
      .to.throw(MoreDependenciesMatchedException)
  })

  it('resolves a dependency as an optional', () => {
    expect(container.resolveOptional<Abstract>(Abstract))
      .to.be.an.instanceOf(None)

    container.bind<ChildDependency>(ChildDependency).to(Abstract)

    expect(container.resolveOptional<Abstract>(Abstract))
      .to.be.an.instanceOf(Some)
      .and.to.satisfy(o => o.unwrap() instanceof Abstract)
  })

  it('has an annotation that works with no args', () => {
    container.bind<ChildDependency>(ChildDependency).to(Abstract)

    expect(new Annotated().testAutowired)
      .to.be.an.instanceOf(Abstract)
  })

  it('has an annotation that works with type specified', () => {
    container.bind<ChildDependency>(ChildDependency).to(Abstract)

    expect(new Annotated().testType)
      .to.be.an.instanceOf(Abstract)
  })

  it('has an annotation that resolves a dependency with constructor arguments', () => {
    container.bind<ChildDependency>(ChildDependency).to(Abstract)

    expect(new Annotated().testWith)
      .to.be.an.instanceOf(Abstract)
      .and.to.have.property('type').that.equals('arg')
  })

  it('has an annotation that resolves a dependency with constructor arguments as params', () => {
    container.bindParam('test', 'arg')
    container.bind<ChildDependency>(ChildDependency).to(Abstract)

    expect(new Annotated().testWithParam)
      .to.be.an.instanceOf(Abstract)
      .and.to.have.property('type').that.equals('arg')
  })

  it('has an annotation that resolves an optional', () => {
    container.bind<ChildDependency>(ChildDependency).to(Abstract)

    expect(new Annotated().testOptional)
      .to.be.an.instanceOf(Some)
  })

  it('has an annotation that resolves the container instance', () => {
    expect(new Annotated().container)
      .to.deep.equal(container)
  })

  it('has an annotation that resolves tagged dependencies', () => {
    container.bind<ExtensionsDependency>(ExtensionsDependency).to(Abstract)
      .tag('type', 'extensions')
    container.bind<ChromeDependency>(ChromeDependency).to(Abstract)
      .tag('type', 'chrome')

    expect(new Annotated().testTagged)
      .to.be.instanceOf(ExtensionsDependency)
  })

  it('has an annotation that resolves tagged dependencies with tags as params', () => {
    container.bind<ChromeDependency>(ChromeDependency).to(Abstract)
      .tag('type', 'chrome')
    container.bind<ExtensionsDependency>(ExtensionsDependency).to(Abstract)
      .tag('type', 'extensions')

    expect(new Annotated().testTaggedParam)
      .to.be.instanceof(ChromeDependency)
      .and.not.be.instanceof(ExtensionsDependency)
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

class Annotated {

  @Autowired<Abstract>()
  public testAutowired: Abstract

  @Inject<Abstract>({ type: Abstract })
  public testType: ChildDependency

  @Optionally<Abstract>(Abstract)
  public testOptional: Optional<Abstract>

  @With<Abstract>(['arg'])
  public testWith: Abstract

  @With<Abstract>(['%test%'])
  public testWithParam: Abstract

  @Tagged<Abstract>({ type: 'extensions' })
  public testTagged: Abstract

  @Tagged<Abstract>({ type: '%browser%' })
  public testTaggedParam: Abstract

  @Self()
  public container: Container

}
