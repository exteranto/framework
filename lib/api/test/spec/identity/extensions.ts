import { expect } from 'chai'

import { Identity } from '@internal/identity'
import { Identity as ExtensionsIdentity } from '@internal/identity/extensions/Identity'

export default ({ browser }) => {
  let identity: Identity

  beforeEach(() => {
    identity = new ExtensionsIdentity
  })

  it('returns redirect url with appended path', () => {
    browser.identity.getRedirectURL
      .returns('https://xyz.extensions.allizom.org/')

    expect(identity.getRedirectUrl('path'))
      .to.equal('https://xyz.extensions.allizom.org/path')
    expect(browser.identity.getRedirectURL.calledOnce).to.be.true
    expect(browser.identity.getRedirectURL.calledWith('path')).to.be.false
  })

  it('resolves redirect url with authentication token', () => {
    const details = { url: 'authentication-endpoint', interactive: true }

    browser.identity.launchWebAuthFlow.withArgs(details)
      .resolves('https://xyz.extensions.allizom.org/oauth2?code=123')

    expect(identity.launchAuthFlow('authentication-endpoint'))
      .to.eventually.equal('https://xyz.extensions.allizom.org/oauth2?code=123')
    expect(browser.identity.launchWebAuthFlow.calledOnce).to.be.true
    expect(browser.identity.launchWebAuthFlow.calledWith(details)).to.be.true
  })

  it('rejects with invalid url argument', () => {
    const details = { url: 'invalid-endpoint', interactive: false }

    browser.identity.launchWebAuthFlow.withArgs(details).rejects()

    expect(identity.launchAuthFlow('invalid-endpoint', false))
      .to.eventually.be.rejected
    expect(browser.identity.launchWebAuthFlow.calledOnce).to.be.true
    expect(browser.identity.launchWebAuthFlow.calledWith(details)).to.be.true
  })

}
