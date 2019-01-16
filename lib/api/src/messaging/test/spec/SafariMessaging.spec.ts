import * as sinon from 'sinon'
import { safari } from '../safari'
import { Container } from '@exteranto/ioc'
import { Browser } from '@exteranto/support'
import { Message, Messaging } from '../../src'

describe('Messaging API for Safari', () => {
  let messaging

  before(() => {
    Container.bindParam('browser', Browser.SAFARI)

    messaging = Container.resolve(Messaging)
  })

  it('boots up a message listener', () => {
    messaging.listen()

    sinon.assert.calledOnce(safari.application.addEventListener)
  })

  it('sends a message via runtime port', async () => {
    Math.random = sinon.stub().returns(1)

    const message: Message = new TestMessage('test')

    messaging.send(message)

    sinon.assert.calledOnce(safari.self.tab.dispatchMessage)
    sinon.assert.calledWith(safari.self.tab.dispatchMessage, '_', { event: 'TestMessage', payload: 'test', id: '1' })
  })
})

class TestMessage extends Message {
  //
}
