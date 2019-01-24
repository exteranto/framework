import { expect } from 'chai'
import * as sinon from 'sinon'

import { Messaging, Message } from '@internal/messaging'
import { Messaging as ExtensionsMessaging } from '@internal/messaging/extensions/Messaging'

export default ({ browser }) => {
  let messaging: Messaging

  beforeEach(() => {
    messaging = new ExtensionsMessaging
  })

  it('boots up a message listener', () => {
    messaging.listen()

    sinon.assert.calledOnce(browser.runtime.onConnect.addListener)
  })

  it('sends a message via runtime port', async () => {
    browser.runtime.connect.returns({
      postMessage: m => m,
      onMessage: { addListener: l => l({ ok: true, body: 'resolved' }) }
    })

    await expect(messaging.send(new TestMessage('test')))
      .to.eventually.equal('resolved')

    sinon.assert.calledOnce(browser.runtime.connect)
  })

  it('rejects the promise when error returned', async () => {
    browser.runtime.connect.returns({
      postMessage: m => m,
      onMessage: { addListener: l => l({ ok: false, body: 'error' }) }
    })

    await expect(messaging.send(new TestMessage('test')))
      .to.eventually.be.rejected
      .and.to.equal('error')

    sinon.assert.calledOnce(browser.runtime.connect)
  })
}

class TestMessage extends Message {
  //
}
