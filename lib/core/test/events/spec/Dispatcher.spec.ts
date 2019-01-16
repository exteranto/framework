import { expect } from 'chai'
import { Dispatcher, Event, Listen, Listener, ListenerBag, Middleware } from '../../src'

describe('Dispatcher', () => {
  let dispatcher

  before(() => {
    dispatcher = new Dispatcher()
  })

  afterEach(() => {
    dispatcher.events = {}
  })

  it('communicates with the listener bag', () => {
    expect(dispatcher.touch(TestEvent)).to.be.instanceof(ListenerBag)
  })

  it('binds an event listener', (done) => {
    dispatcher.touch(TestEvent).addListener(new class implements Listener {
      public handle (event: TestEvent) : void {
        try {
          expect(event.getText()).to.equal('asd')
          done()
        } catch (e) { done(e) }
      }
    })

    dispatcher.fire(new TestEvent({ text: 'asd' }))
  })

  it('binds an event hook', (done) => {
    dispatcher.touch(TestEvent).addHook((event: TestEvent) => {
      try {
        expect(event.getText()).to.equal('hook')
        done()
      } catch (e) { done(e) }
    })

    dispatcher.fire(new TestEvent({ text: 'hook' }))
  })

  it('supports named exceptions', (done) => {
    dispatcher.touch(TestException).addHook((event: TestException) => {
      try {
        expect(event).to.be.instanceOf(TestException)
          .and.to.have.property('message')
          .that.equals('exception_request')
        done()
      } catch (e) { done(e) }
    })

    dispatcher.touch(TestEvent).addHook((event: TestEvent) => {
      throw new TestException(`exception_${event.getText()}`)
    })

    dispatcher.fire(new TestEvent({ text: 'request' }))
  })

  it('puts an event to mailbox', () => {
    dispatcher.mail(new TestEvent)
    dispatcher.mail(new TestEvent)

    expect(dispatcher.touch(TestEvent).mailbox)
      .to.have.lengthOf(2)
  })

  it('fires events upon assigning a listener and clears mailbox', (done) => {
    dispatcher.mail(new TestEvent({ text: 'test' }))

    dispatcher.touch(TestEvent).addHook((event: TestEvent) => {
      try {
        expect(event.getText()).to.equal('test')
        expect(dispatcher.touch(TestEvent).mailbox).to.have.lengthOf(0)
        done()
      } catch (e) { done(e) }
    })
  })

  it('adds event middlware to a listener bag', async () => {
    dispatcher.touch(TestEvent).addMiddleware(new class implements Middleware {
      public async handle (payload: any) : Promise<any> {
        return payload + '1'
      }
    })

    expect(dispatcher.touch(TestEvent).middleware).to.have.lengthOf(1)
  })

  it('correctly exetuces middleware', (done) => {
    dispatcher.touch(TestEvent).addMiddleware(new class implements Middleware {
      public async handle (event: TestEvent) {
        event.setText(event.getText() + '_changed')

        return event
      }
    })

    dispatcher.touch(TestEvent).addHook((event: TestEvent) => {
      try {
        expect(event.getText()).to.equal('request_changed')
        done()
      } catch (e) { done(e) }
    })

    dispatcher.fire(new TestEvent({ text: 'request' }))
  })

  it('correctly handles exceptions from a middleware', (done) => {
    dispatcher.touch(TestEvent).addMiddleware(new class implements Middleware {
      public async handle (event: TestEvent) {
        throw new TestException(`exception_${event.getText()}`)
      }
    })

    dispatcher.touch(TestException).addHook((event: TestException) => {
      try {
        expect(event).to.be.instanceOf(TestException)
          .and.to.have.property('message')
          .that.equals('exception_request')
        done()
      } catch (e) { done(e) }
    })

    dispatcher.touch(TestEvent).addHook(() => {
      done(new Error('Should not have been called.'))
    })

    dispatcher.fire(new TestEvent({ text: 'request' }))
  })

  it('correctly handles exceptions from a middleware', (done) => {
    dispatcher.touch(TestEvent).addMiddleware(new class implements Middleware {
      public async handle (event: TestEvent) {
        throw new TestException(`exception_${event.getText()}`)
      }
    })

    dispatcher.touch(TestException).addHook((event: TestException) => {
      try {
        expect(event).to.be.instanceOf(TestException)
          .and.to.have.property('message')
          .that.equals('exception_request')
        done()
      } catch (e) { done(e) }
    })

    dispatcher.touch(TestEvent).addHook(() => {
      done(new Error('Should not have been called.'))
    })

    dispatcher.fire(new TestEvent({ text: 'request' }))
  })

  it('registers event types', () => {
    dispatcher.touch(TestEvent)

    const Constructor = dispatcher.type('TestEvent')
    expect(new Constructor).to.be.instanceOf(TestEvent)
  })
})

class TestException extends Error {
  //
}

class TestEvent extends Event {
  constructor (private data?: any) {
    super()
  }

  public getText () : string {
    return this.data.text
  }

  public setText (text: string) : void {
    this.data.text = text
  }
}
