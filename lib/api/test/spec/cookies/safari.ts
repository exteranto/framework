import { expect } from 'chai'
import { Cookies } from '@internal/cookies'

import { NotImplementedException } from '@exteranto/exceptions'
import { Cookies as SafariCookies } from '@internal/cookies/safari/Cookies'

export default () => {
  let cookies: Cookies

  beforeEach(() => {
    cookies = new SafariCookies
  })

  it('throws exception for all methods', async () => {
    expect(cookies.get('url', 'cookie')).to.eventually.be.rejectedWith(NotImplementedException)
    expect(cookies.getAll({})).to.eventually.be.rejectedWith(NotImplementedException)
    expect(cookies.set({})).to.eventually.be.rejectedWith(NotImplementedException)
    expect(cookies.populate({})).to.eventually.be.rejectedWith(NotImplementedException)
  })
}
