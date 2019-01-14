import { expect } from 'chai'
import * as sinon from 'sinon'
import { Dispatcher, Listener, ListenerBag, Middleware } from '../../src'

describe('Dispatcher', () => {
  let dispatcher

  before(() => {
    dispatcher = new Dispatcher()
  })

  afterEach(() => {
    dispatcher.events = {}
  })

  it('communicates with the listener bag', () => {
    expect(dispatcher.touch('test')).to.be.instanceof(ListenerBag)
  })

  it('binds an event listener', (done) => {
    dispatcher.touch('test-listener').addListener(new TestListener)
    dispatcher.fire('test-listener', { test: 'test-listener', done })
  })

  it('binds an event hook', (done) => {
    dispatcher.touch('test-hook').addHook((payload) => {
      try {
        expect(payload.test).to.equal('test-hook')
        payload.done()
      } catch (e) {
        payload.done(e)
      }
    })

    dispatcher.fire('test-hook', { test: 'test-hook', done })
  })

  it('supports named exceptions', (done) => {
    dispatcher.touch('app.exception.test-exception').addHook((payload) => {
      expect(payload).to.be.instanceof(TestException)

      done()
    })

    dispatcher.touch('faulty-event').addHook(() => {
      throw new TestException()
    })

    dispatcher.fire('faulty-event')
  })

  it('puts an event to mailbox', () => {
    dispatcher.mail('app.events.test-mailbox-1')
    dispatcher.mail('app.events.test-mailbox-1')

    expect(dispatcher.touch('app.events.test-mailbox-1').mailbox)
      .to.have.lengthOf(2)
  })

  it('fires events upon assigning a listener and clears mailbox', async () => {
    const spy = sinon.spy()
    const handle = payload => new Promise((resolve) => {
      spy(payload)
      resolve()
    })

    dispatcher.mail('app.events.test-mailbox-2', 'payload')
    dispatcher.touch('app.events.test-mailbox-2').addHook(handle)

    await handle

    sinon.assert.calledOnce(spy)
    sinon.assert.calledWith(spy, 'payload')

    expect(dispatcher.touch('app.events.test-mailbox-2').mailbox)
      .to.have.lengthOf(0)
  })

  it('adds event middlware to a listener bag', async () => {
    dispatcher.touch('app.events.test-middleware-1').addMiddleware(new class implements Middleware {
      public async handle (payload: any) {
        return payload + '1'
      }
    })

    expect(dispatcher.touch('app.events.test-middleware-1').middleware).to.have.lengthOf(1)
  })

  it('correctly exetuces middleware', (done) => {
    dispatcher.touch('app.events.test-middleware-2').addMiddleware(new class implements Middleware {
      public async handle (payload: any) {
        return payload + '1'
      }
    })

    dispatcher.touch('app.events.test-middleware-2').addHook((payload) => {
      try {
        expect(payload).to.equal('request1')
        done()
      } catch (e) {
        done(e)
      }
    })

    dispatcher.fire('app.events.test-middleware-2', 'request')
  })

  it('correctly handles exceptions from a middleware', (done) => {
    dispatcher.touch('app.events.test-middleware-3').addMiddleware(new class implements Middleware {
      public async handle (payload: any) {
        throw new TestException
      }
    })

    dispatcher.touch('app.exception.test-exception').addHook((payload) => {
      try {
        expect(payload).to.be.instanceOf(TestException)
        done()
      } catch (e) {
        done(e)
      }
    })

    dispatcher.touch('app.events.test-middleware-3').addHook(() => {
      done(new Error('Should now have been called.'))
    })

    dispatcher.fire('app.events.test-middleware-3', 'request')
  })
})

class TestListener implements Listener {

  public handle(payload: any) : void {
    expect(payload.test).to.equal('test-listener')

    payload.done()
  }
}

class TestException extends Error {
  public name: string = 'test-exception'
}
