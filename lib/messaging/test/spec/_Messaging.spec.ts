import * as sinon from 'sinon'
import { Container } from '@exteranto/ioc'
import { Browser } from '@exteranto/support'
import { Message, Messaging } from '../../src'

describe('Messaging API in general', () => {
  let messaging

  before(() => {
    Container.bindParam('browser', Browser.CHROME)

    messaging = Container.resolve(Messaging)
  })

  it('dispatches an appropriate event', () => {
    let stub = messaging.dispatcher.type = sinon.stub()
    let spy = messaging.dispatcher.fire = sinon.spy()

    stub.returns(TestMessage)

    messaging.dispatch('test', 'hello', 1, null)

    sinon.assert.calledOnce(spy)
    sinon.assert.calledWith(spy, sinon.match.instanceOf(TestMessage))
  })
})


class TestMessage extends Message {
  //
}
