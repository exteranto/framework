import * as sinon from 'sinon'
import { safari } from '../safari'
import { Container } from '@exteranto/ioc'
import { Browser, Script } from '@exteranto/support'
import { Messaging } from '../../src/Messaging'

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

    messaging.send(Script.POPUP, 'test', 'test')

    sinon.assert.calledOnce(safari.self.tab.dispatchMessage)
    sinon.assert.calledWith(safari.self.tab.dispatchMessage, '_', { script: Script.POPUP, event: 'test', payload: 'test', id: '1' })
  })
})
