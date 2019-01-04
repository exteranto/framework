import { expect } from 'chai'
import * as sinon from 'sinon'
import { Listener } from '../../src/Listener'
import { Dispatcher } from '../../src/Dispatcher'
import { ListenerBag } from '../../src/ListenerBag'

describe('Dispatcher', () => {
  let dispatcher

  before(() => {
    dispatcher = new Dispatcher()
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
      expect(payload.test).to.equal('test-hook')

      payload.done()
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

  it('fires events upon assigning a listener and clears mailbox', () => {
    const spy = sinon.spy()

    dispatcher.mail('app.events.test-mailbox-2', 'payload')
    dispatcher.touch('app.events.test-mailbox-2').addHook(spy)

    sinon.assert.calledOnce(spy)
    sinon.assert.calledWith(spy, 'payload')
    expect(dispatcher.touch('app.events.test-mailbox-2').mailbox)
      .to.have.lengthOf(0)

    dispatcher.mail('app.events.test-mailbox-2', 'payload')

    sinon.assert.calledTwice(spy)
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
