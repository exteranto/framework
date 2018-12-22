import { expect } from 'chai'
import { App } from '../../src/App'
import { Container } from '@exteranto/ioc'
import { Dispatcher, Listener } from '@exteranto/events'
import { Browser, Provider, Script } from '@exteranto/support'

describe('App Class', () => {
  let dispatcher

  before(() => {
    dispatcher = Container.resolve(Dispatcher)
  })

  it('should register base container parameters', () => {
    new App(Script.BACKGROUND, { providers: [] }, {}).bootstrap()

    expect(Container.resolveParam('browser')).to.equal(Browser.TESTING)
    expect(Container.resolveParam('script')).to.equal(Script.BACKGROUND)
  })

  it('should find providers', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [TestProvider] }, {})
    app.bootstrap()

    expect((app as any).providers).to.have.lengthOf(1)
  })

  it('should boot providers', () => {
    new App(Script.BACKGROUND, { providers: [TestProvider] }, {}).bootstrap()

    expect(Container.resolveParam('test')).to.equal('test')
  })

  it('should register providers', () => {
    new App(Script.BACKGROUND, { providers: [TestProvider] }, {}).bootstrap()

    expect(Container.resolveParam('test2')).to.equal('test2')
  })

  it('should register param bindings', () => {
    new App(Script.BACKGROUND, { providers: [], bound: { param: 'exteranto' } }, {}).bootstrap()

    expect(Container.resolveParam('param')).to.equal('exteranto')
  })

  it('should register events', (done) => {
    new App(Script.BACKGROUND, { providers: [] }, { 'app.test': TestListener }).bootstrap()

    dispatcher.fire('app.test', done)
  })

  it('should fire the app.booted event', (done) => {
    new App(Script.BACKGROUND, { providers: [] }, { 'app.booted': class implements Listener {
      handle () : void {
        done()
      }
    } }).bootstrap()
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
