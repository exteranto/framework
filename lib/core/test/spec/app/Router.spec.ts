import { expect } from 'chai'

import { App, Router } from '@internal/app'
import { Provider, Script } from '@internal/support'
import { InvalidRouteException } from '@exteranto/exceptions'

describe('Router', () => {

  afterEach(() => {
    (Router as any).routes = {}
  })

  it('registers global routes for a given script', () => {
    ;(Router as any).script = Script.CONTENT
    Router.add([{ name: 'test' }])

    expect(Router.get()).to.have.lengthOf(1)
      .and.to.deep.include({ name: 'test' })
  })

  it('does not register routes without a name', () => {
    ;(Router as any).script = Script.CONTENT

    expect(() => Router.add(['test'])).to.throw(InvalidRouteException)
  })


  it('does not register routes for the backgrounnd script', () => {
    ;(Router as any).script = Script.BACKGROUND

    Router.add([{ name: 'test' }])

    expect(Router.get()).to.have.lengthOf(0)
  })

  it('registers routes to a default script', () => {
    ;(Router as any).script = Script.CONTENT
    Router.add([{ name: 'test' }])

    expect(Router.get()).to.have.lengthOf(1)
      .and.to.deep.include({ name: 'test' })
  })

  it('chains', () => {
    ;(Router as any).script = Script.CONTENT

    expect(Router.add([{ name: 'test' }]).get()).to.have.lengthOf(1)
      .and.to.deep.include({ name: 'test' })
  })

  it('registers routes via provider', () => {
    const app: App = new App(Script.CONTENT, { providers: [TestProvider] }, () => {})
    app.start()
    app.boot()

    expect(Router.get()).to.have.lengthOf(2)
      .and.to.deep.include({ name: 'test' })
      .and.to.deep.include({ name: 'test2' })
  })

  it('edits a route', () => {
    ;(Router as any).script = Script.CONTENT

    Router.add([{ name: 'test' }])
    Router.edit('test', (r) => {
      r.meta = { title: 'title' }
      return r
    })

    expect(Router.get()).to.have.lengthOf(1)
      .and.to.deep.include({ name: 'test', meta: { title: 'title' } })
  })

  it('edits a route before its creation', () => {
    ;(Router as any).script = Script.CONTENT

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
