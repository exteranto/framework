import { expect } from 'chai'
import * as sinon from 'sinon'

import { Container, Script } from '@exteranto/core'
import { Messaging, Message } from '@internal/messaging'
import { Messaging as SafariMessaging } from '@internal/messaging/safari/Messaging'

export default ({ safari }) => {
  let messaging: Messaging

  beforeEach(() => {
    messaging = new SafariMessaging
    Container.getInstance().bindParam('script', Script.BACKGROUND)
  })

  it('boots up a message listener', () => {
    messaging.listen()

    sinon.assert.calledOnce(safari.application.addEventListener)
  })

  it('boots up a message listener for the content script', () => {
    ;(messaging as any).script = Script.CONTENT

    messaging.listen()

    sinon.assert.calledOnce(safari.self.addEventListener)
  })

  it('sends a message via runtime port', async () => {
    Math.random = sinon.stub().returns(1)

    const message: Message = new TestMessage('test')

    messaging.send(message)

    sinon.assert.calledOnce(safari.self.tab.dispatchMessage)
    sinon.assert.calledWith(safari.self.tab.dispatchMessage, '_', { event: 'TestMessage', payload: 'test', id: '1' })
  })

  it('rejects the promise when error returned', (done) => {
    messaging.listen()

    Math.random = sinon.stub().returns(2)

    messaging.send(new TestMessage('test'))
      .catch((e) => {
        try {
          expect(e).to.equal('error')
          done()
        } catch (e) { done(e) }
      })

    safari.application.trigger('message', {
      name: '_response_',
      message: { id: '2', payload: { ok: false, body: 'error' } }
    })
  })
}

class TestMessage extends Message {
  //
}
