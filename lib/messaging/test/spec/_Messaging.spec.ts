import { expect } from 'chai'
import * as sinon from 'sinon'
import { Container } from '@exteranto/ioc'
import { Messaging } from '../../src/Messaging'
import { Browser, Script } from '@exteranto/support'

describe('Messaging API in general', () => {
  let messaging

  before(() => {
    Container.bindParam('browser', Browser.CHROME)

    messaging = Container.resolve(Messaging)
  })

  it('dispatches an appropriate event', () => {
    let spy = messaging.dispatcher.fire = sinon.spy()

    messaging.dispatch({
      script: Script.BACKGROUND,
      event: 'test',
      payload: 'test'
    }, 'respond')

    sinon.assert.calledOnce(spy)
    sinon.assert.calledWith(spy, 'test', {
      request: 'test',
      respond: 'respond'
    })
  })

  it('does not dispatch inappropriate event', () => {
    let spy = messaging.dispatcher.fire = sinon.spy()

    messaging.dispatch({
      script: Script.POPUP,
      event: 'test',
      payload: 'test'
    }, 'respond')

    sinon.assert.notCalled(spy)
  })
})
