import { expect } from 'chai'

import { Identity } from '@internal/identity'
import { Identity as ChromeIdentity } from '@internal/identity/chrome/Identity'

export default ({ chrome }) => {
  let identity: Identity

  beforeEach(() => {
    identity = new ChromeIdentity
  })

  it('returns redirect url with appended path', () => {
    chrome.identity.getRedirectURL.withArgs('path')
      .returns('https://xyz.chromiumapp.org/' + 'path')

    expect(identity.getRedirectUrl('path'))
      .to.equal('https://xyz.chromiumapp.org/path')
    expect(chrome.identity.getRedirectURL.calledOnce).to.be.true
    expect(chrome.identity.getRedirectURL.calledWith('path')).to.be.true
  })

  it('resolves redirect url with authentication token', () => {
    const details = { url: 'authentication-endpoint', interactive: true }

    chrome.identity.launchWebAuthFlow.withArgs(details)
      .resolves('https://xyz.chromiumapp.org/oauth2?code=123')

    expect(identity.launchAuthFlow('authentication-endpoint'))
      .to.eventually.equal('https://xyz.chromiumapp.org/oauth2?code=123')
    expect(chrome.identity.launchWebAuthFlow.calledOnce).to.be.true
    expect(chrome.identity.launchWebAuthFlow.calledWith(details)).to.be.true
  })

  it('rejects with invalid url argument', () => {
    const details = { url: 'invalid-endpoint', interactive: false }

    chrome.runtime.lastError = { message: 'test' }
    chrome.identity.launchWebAuthFlow.yields(undefined)

    expect(identity.launchAuthFlow('invalid-endpoint', false))
      .to.eventually.be.rejected
    expect(chrome.identity.launchWebAuthFlow.calledOnce).to.be.true
    expect(chrome.identity.launchWebAuthFlow.calledWith(details)).to.be.true
  })

}
