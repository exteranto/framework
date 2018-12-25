import { expect } from 'chai'
import { App, Router } from '../../src'
import { Container } from '@exteranto/ioc'
import { Provider, Script } from '@exteranto/support'

describe('Router Class', () => {

  afterEach(() => {
    (Router as any).routes = []
  })

  it('should register global routes for a given script', () => {
    Container.bindParam('script', Script.CONTENT)
    Router.add(['test'], Script.CONTENT)

    expect(Router.get()).to.have.lengthOf(1)
      .and.to.include('test')
  })

  it('should not register routes for different script', () => {
    Container.bindParam('script', Script.CONTENT)
    Router.add(['test'], Script.POPUP)

    expect(Router.get()).to.have.lengthOf(0)
  })

  it('should register routes to a default script', () => {
    Container.bindParam('script', Script.CONTENT)
    Router.add(['test'])

    expect(Router.get()).to.have.lengthOf(1)
      .and.to.include('test')
  })

  it('should chain', () => {
    Container.bindParam('script', Script.CONTENT)

    expect(Router.add(['test']).get()).to.have.lengthOf(1)
      .and.to.include('test')
  })

  it('should register routes via provider', () => {
    const app: App = new App(Script.CONTENT, { providers: [TestProvider] }, {})
    app.start()
    app.boot()


    expect(Router.get()).to.have.lengthOf(2)
      .and.to.include('test')
      .and.to.include('test2')
  })
})

class TestProvider extends Provider {
  boot () : void {
    //
  }

  register () : void {
    this.router.add(['test', 'test2'])
  }
}
