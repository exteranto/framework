import { expect } from 'chai'
import { App, Router } from '../../src'
import { Container } from '@exteranto/ioc'
import { Provider, Script } from '@exteranto/support'
import { InvalidRouteException } from '@exteranto/exceptions'

describe('Router Class', () => {

  afterEach(() => {
    (Router as any).routes = {}
  })

  it('should register global routes for a given script', () => {
    Container.bindParam('script', Script.CONTENT)
    Router.add([{ name: 'test' }], Script.CONTENT)

    expect(Router.get()).to.have.lengthOf(1)
      .and.to.deep.include({ name: 'test' })
  })

  it('should not register routes without a name', () => {
    Container.bindParam('script', Script.CONTENT)

    expect(() => Router.add(['test'], Script.CONTENT)).to.throw(InvalidRouteException)
  })


  it('should not register routes for different script', () => {
    Container.bindParam('script', Script.CONTENT)
    Router.add([{ name: 'test' }], Script.POPUP)

    expect(Router.get()).to.have.lengthOf(0)
  })

  it('should register routes to a default script', () => {
    Container.bindParam('script', Script.CONTENT)
    Router.add([{ name: 'test' }])

    expect(Router.get()).to.have.lengthOf(1)
      .and.to.deep.include({ name: 'test' })
  })

  it('should chain', () => {
    Container.bindParam('script', Script.CONTENT)

    expect(Router.add([{ name: 'test' }]).get()).to.have.lengthOf(1)
      .and.to.deep.include({ name: 'test' })
  })

  it('should register routes via provider', () => {
    const app: App = new App(Script.CONTENT, { providers: [TestProvider] }, {})
    app.start()
    app.boot()


    expect(Router.get()).to.have.lengthOf(2)
      .and.to.deep.include({ name: 'test' })
      .and.to.deep.include({ name: 'test2' })
  })

  it('should edit a route', () => {
    Container.bindParam('script', Script.CONTENT)

    Router.add([{ name: 'test' }])
    Router.edit('test', (r) => {
      r.meta = { title: 'title' }
      return r
    })

    expect(Router.get()).to.have.lengthOf(1)
      .and.to.deep.include({ name: 'test', meta: { title: 'title' } })
  })

  it('should edit a route before its creation', () => {
    Container.bindParam('script', Script.CONTENT)

    Router.edit('test', (r) => {
      r.meta = { title: 'title' }
      return r
    })
    Router.add([{ name: 'test' }])

    expect(Router.get()).to.have.lengthOf(1)
      .and.to.deep.include({ name: 'test', meta: { title: 'title' } })
  })
})

class TestProvider extends Provider {
  boot () : void {
    //
  }

  register () : void {
    this.router.add([{ name: 'test' }, { name: 'test2' }])
  }
}
