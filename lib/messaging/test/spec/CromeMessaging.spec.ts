import { expect } from 'chai'
import * as sinon from 'sinon'
import * as chrome from 'sinon-chrome'
import { Container } from '@exteranto/ioc'
import { Messaging } from '../../src/Messaging'
import { Browser, Script } from '@exteranto/support'

describe('Messaging API for Chrome', () => {
  let messaging

  before(() => {
    Container.bindParam('browser', Browser.CHROME)

    messaging = Container.resolve(Messaging)
  })

  it('boots up a message listener', () => {
    messaging.listen()

    sinon.assert.calledOnce(chrome.runtime.onConnect.addListener)
  })

  it('sends a message via runtime port', async () => {
    chrome.runtime.connect.returns({
      postMessage: m => m,
      onMessage: { addListener: l => l('resolved') }
    })

    await expect(messaging.send(Script.POPUP, 'test', 'test'))
      .to.eventually.equal('resolved')

    sinon.assert.calledOnce(chrome.runtime.connect)
  })
})
