import { expect } from 'chai'
import { mock, instance, verify, deepEqual, when, anything } from 'ts-mockito'

import { Container } from '@internal/ioc'
import { Dispatcher, Event } from '@internal/events'
import { Provider, Script } from '@internal/support'
import { App, WindowLoadedEvent, AppBootedEvent } from '@internal/app'

describe('App', () => {
  let dispatcher: Dispatcher

  beforeEach(() => {
    dispatcher = mock(Dispatcher)

    when(dispatcher.touch(anything())).thenReturn({
      addHook: () => {},
      addListener: () => {},
      addMiddleware: () => {},
    } as any)
  })

  it('registers base container parameters', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [] }, () => {})
    app.start()
    app.boot()

    expect(Container.resolveParam('browser')).to.be.ok
    expect(Container.resolveParam('script')).to.equal(Script.BACKGROUND)
  })

  it('finds providers', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [TestProvider] }, () => {})
    app.start()
    app.boot()

    expect((app as any).providers).to.have.lengthOf(1)
  })

  it('boots providers', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [TestProvider] }, () => {})
    app.start()
    app.boot()

    expect(Container.resolveParam('test')).to.equal('test')
  })

  it('registers providers', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [TestProvider] }, () => {})
    app.start()
    app.boot()

    expect(Container.resolveParam('test2')).to.equal('test2')
  })

  it('registers param bindings', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [], bound: { param: 'exteranto' } }, () => {})
    app.start()
    app.boot()

    expect(Container.resolveParam('param')).to.equal('exteranto')
  })

  it('registers events', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [] }, (touch) => {
      touch(TestEvent).addHook(() => {})
    })

    ;(app as any).dispatcher = instance(dispatcher)

    app.start()
    app.boot()

    verify(dispatcher.touch(TestEvent)).once()
  })

  it('fires the app booted event', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [] }, () => {})

    ;(app as any).dispatcher = instance(dispatcher)

    app.start()
    app.boot()

    verify(dispatcher.fire(deepEqual(new AppBootedEvent))).once()
  })

  it('registers the window load event', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [] }, () => {})

    ;(app as any).dispatcher = instance(dispatcher)

    app.start()
    app.boot()

    verify(dispatcher.mail(deepEqual(new WindowLoadedEvent))).once()
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

class TestEvent extends Event {
  //
}
