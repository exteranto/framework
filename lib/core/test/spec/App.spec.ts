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

  it('should register providers', () => {
    new App(Script.BACKGROUND, { providers: [TestProvider] }, {}).bootstrap()

    expect(Container.resolveParam('test')).to.equal('test')
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

  register (container: any) : void {
    container.bindParam('test', 'test')
  }
}

class TestListener implements Listener {

  handle (payload: any) : void {
    payload()
  }
}
