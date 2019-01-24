import { expect } from 'chai'
import * as sinon from 'sinon'

import { Messaging, Message } from '@internal/messaging'
import { Messaging as ChromeMessaging } from '@internal/messaging/chrome/Messaging'

export default ({ chrome }) => {
  let messaging: Messaging

  beforeEach(() => {
    messaging = new ChromeMessaging
  })

  it('boots up a message listener', () => {
    messaging.listen()

    sinon.assert.calledOnce(chrome.runtime.onConnect.addListener)
  })

  it('sends a message via runtime port', async () => {
    chrome.runtime.connect.returns({
      postMessage: m => m,
      onMessage: { addListener: l => l({ ok: true, body: 'resolved' }) }
    })

    await expect(messaging.send(new TestMessage('test')))
      .to.eventually.equal('resolved')

    sinon.assert.calledOnce(chrome.runtime.connect)
  })

  it('rejects the promise when error returned', async () => {
    chrome.runtime.connect.returns({
      postMessage: m => m,
      onMessage: { addListener: l => l({ ok: false, body: 'error' }) }
    })

    await expect(messaging.send(new TestMessage('test')))
      .to.eventually.be.rejected
      .and.to.equal('error')

    sinon.assert.calledOnce(chrome.runtime.connect)
  })
}

class TestMessage extends Message {
  //
}
