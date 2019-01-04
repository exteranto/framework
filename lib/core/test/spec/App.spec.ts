import { expect } from 'chai'
import { App } from '../../src'
import { Container } from '@exteranto/ioc'
import { Dispatcher, Listener } from '@exteranto/events'
import { Browser, Provider, Script } from '@exteranto/support'

describe('App Class', () => {
  let dispatcher

  before(() => {
    dispatcher = Container.resolve(Dispatcher)
  })

  afterEach(() => {
    (dispatcher as any).events = {}
  })

  it('should register base container parameters', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [] }, {})
    app.start()
    app.boot()

    expect(Container.resolveParam('browser')).to.equal(Browser.TESTING)
    expect(Container.resolveParam('script')).to.equal(Script.BACKGROUND)
  })

  it('should find providers', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [TestProvider] }, {})
    app.start()
    app.boot()

    expect((app as any).providers).to.have.lengthOf(1)
  })

  it('should boot providers', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [TestProvider] }, {})
    app.start()
    app.boot()

    expect(Container.resolveParam('test')).to.equal('test')
  })

  it('should register providers', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [TestProvider] }, {})
    app.start()
    app.boot()

    expect(Container.resolveParam('test2')).to.equal('test2')
  })

  it('should register param bindings', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [], bound: { param: 'exteranto' } }, {})
    app.start()
    app.boot()

    expect(Container.resolveParam('param')).to.equal('exteranto')
  })

  it('should register events', (done) => {
    const app: App = new App(Script.BACKGROUND, { providers: [] }, { 'app.test': TestListener })
    app.start()
    app.boot()

    dispatcher.fire('app.test', done)
  })

  it('should fire the app.booted event', (done) => {
    const app: App = new App(Script.BACKGROUND, { providers: [] }, { 'app.booted': class implements Listener {
      handle () : void {
        done()
      }
    } })
    app.start()
    app.boot()
  })

})

class TestProvider extends Provider {

  boot () : void {
    this.container.bindParam('test', 'test')
  }

  register () : void {
    this.container.bindParam('test2', 'test2')
  }
}

class TestListener implements Listener {

  handle (payload: any) : void {
    payload()
  }
}
