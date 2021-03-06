import { expect } from 'chai'
import * as sinon from 'sinon'
import { mock, instance, verify, deepEqual } from 'ts-mockito'

import { Dispatcher } from '@exteranto/core'
import { EmptyResponseException } from '@internal/exceptions'
import { Cookies, CookieChangedEvent } from '@internal/cookies'
import { Cookies as ChromeCookies } from '@internal/cookies/chrome/Cookies'
import { InvalidCookieRequestException } from '@internal/cookies/exceptions'

export default ({ chrome }) => {
  let cookies: Cookies
  let dispatcher: Dispatcher

  beforeEach(() => {
    dispatcher = mock(Dispatcher)
    cookies = new ChromeCookies
  })

  afterEach(() => {
    chrome.runtime.lastError = undefined
  })

  it('gets a cookie by name and url', async () => {
    chrome.cookies.get.yields({ name: 'cookie' })

    expect(await cookies.get('url', 'cookie'))
      .to.have.property('name').which.is.equal('cookie')

    sinon.assert.calledOnce(chrome.cookies.get)
  })

  it('throws appropriate exception if cookie doesn\'t exist', async () => {
    chrome.cookies.get.yields(null)

    await expect(cookies.get('url', 'cookie'))
      .to.eventually.be.rejectedWith(EmptyResponseException)

    sinon.assert.calledOnce(chrome.cookies.get)
  })

  it('throws appropriate exception if get method fails', async () => {
    chrome.cookies.get.yields(null)
    chrome.runtime.lastError = { message: 'failed' }

    await expect(cookies.get('url', 'cookie'))
      .to.eventually.be.rejectedWith(InvalidCookieRequestException)

    sinon.assert.calledOnce(chrome.cookies.get)
  })

  it('gets all cookies based on params', async () => {
    chrome.cookies.getAll.yields([1, 2, 3])

    await expect(cookies.getAll({}))
      .to.eventually.be.an('array').which.has.lengthOf(3)

    sinon.assert.calledOnce(chrome.cookies.getAll)
  })

  it('throws appropriate exception if get all method fails', async () => {
    chrome.cookies.getAll.yields(undefined)
    chrome.runtime.lastError = { message: 'failed' }

    await expect(cookies.getAll({}))
      .to.eventually.be.rejectedWith(InvalidCookieRequestException)

    sinon.assert.calledOnce(chrome.cookies.getAll)
  })

  it('sets a cookie', async () => {
    chrome.cookies.set.yields(undefined)

    await expect(cookies.set({})).not.to.be.eventually.rejected

    sinon.assert.calledOnce(chrome.cookies.set)
  })

  it('throws appropriate exception if set method fails', async () => {
    chrome.cookies.set.yields(undefined)
    chrome.runtime.lastError = { message: 'failed' }

    await expect(cookies.set({}))
      .to.eventually.be.rejectedWith(InvalidCookieRequestException)

    sinon.assert.calledOnce(chrome.cookies.set)
  })

  it('registers event listener', () => {
    cookies.registerEvents(instance(dispatcher))

    chrome.cookies.onChanged.trigger('cookie')

    verify(dispatcher.fire(deepEqual(new CookieChangedEvent('cookie')))).once()
  })

  it('populates does not override existing cookie', async () => {
    chrome.cookies.getAll.yields([1])

    await cookies.populate({})

    sinon.assert.calledOnce(chrome.cookies.getAll)
    sinon.assert.notCalled(chrome.cookies.set)
  })

  it('populates sets new cookie if it doesn\'t exist', async () => {
    chrome.cookies.getAll.yields([])

    await cookies.populate({})

    sinon.assert.calledOnce(chrome.cookies.getAll)
    sinon.assert.calledOnce(chrome.cookies.set)
  })
}
