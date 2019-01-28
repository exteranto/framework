import { expect } from 'chai'
import * as sinon from 'sinon'
import { mock, instance, verify, deepEqual } from 'ts-mockito'

import { Dispatcher } from '@exteranto/core'
import { Cookies, CookieChangedEvent } from '@internal/cookies'
import { Cookies as ExtensionsCookies } from '@internal/cookies/extensions/Cookies'
import { EmptyResponseException, InvalidCookieRequestException } from '@exteranto/exceptions'

export default ({ browser }) => {
  let cookies: Cookies
  let dispatcher: Dispatcher

  beforeEach(() => {
    dispatcher = mock(Dispatcher)
    cookies = new ExtensionsCookies
  })

  it('gets a cookie by name and url', async () => {
    browser.cookies.get.resolves({ name: 'cookie' })

    expect(await cookies.get('url', 'cookie'))
      .to.have.property('name').which.is.equal('cookie')

    sinon.assert.calledOnce(browser.cookies.get)
  })

  it('throws appropriate exception if cookie doesn\'t exist', async () => {
    browser.cookies.get.resolves(null)

    await expect(cookies.get('url', 'cookie'))
      .to.eventually.be.rejectedWith(EmptyResponseException)

    sinon.assert.calledOnce(browser.cookies.get)
  })

  it('throws appropriate exception if get method fails', async () => {
    browser.cookies.get.rejects()

    await expect(cookies.get('url', 'cookie'))
      .to.eventually.be.rejectedWith(InvalidCookieRequestException)

    sinon.assert.calledOnce(browser.cookies.get)
  })

  it('gets all cookies based on params', async () => {
    browser.cookies.getAll.resolves([1, 2, 3])

    await expect(cookies.getAll({}))
      .to.eventually.be.an('array').which.has.lengthOf(3)

    sinon.assert.calledOnce(browser.cookies.getAll)
  })

  it('throws appropriate exception if get all method fails', async () => {
    browser.cookies.getAll.rejects()

    await expect(cookies.getAll({}))
      .to.eventually.be.rejectedWith(InvalidCookieRequestException)

    sinon.assert.calledOnce(browser.cookies.getAll)
  })

  it('sets a cookie', async () => {
    browser.cookies.set.resolves(undefined)

    await expect(cookies.set({})).not.to.be.eventually.rejected

    sinon.assert.calledOnce(browser.cookies.set)
  })

  it('throws appropriate exception if set method fails', async () => {
    browser.cookies.set.rejects()

    await expect(cookies.set({}))
      .to.eventually.be.rejectedWith(InvalidCookieRequestException)

    sinon.assert.calledOnce(browser.cookies.set)
  })

  it('registers event listener', () => {
    cookies.registerEvents(instance(dispatcher))

    browser.cookies.onChanged.trigger('cookie')

    verify(dispatcher.fire(deepEqual(new CookieChangedEvent('cookie')))).once()
  })

  it('populates does not override existing cookie', async () => {
    browser.cookies.getAll.resolves([1])

    await cookies.populate({})

    sinon.assert.calledOnce(browser.cookies.getAll)
    sinon.assert.notCalled(browser.cookies.set)
  })

  it('populates sets new cookie if it doesn\'t exist', async () => {
    browser.cookies.getAll.resolves([])
    browser.cookies.set.resolves()

    await cookies.populate({})

    sinon.assert.calledOnce(browser.cookies.getAll)
    sinon.assert.calledOnce(browser.cookies.set)
  })
}
