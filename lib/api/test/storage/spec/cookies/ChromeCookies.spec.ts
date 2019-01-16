import { expect } from 'chai'
import * as sinon from 'sinon'
import * as chrome from 'sinon-chrome'
import { Container } from '@exteranto/core'
import { Browser } from '@exteranto/core'
import { Dispatcher } from '@exteranto/core'
import { CookieChangedEvent, Cookies } from '../../../../src'
import {
  EmptyResponseException,
  InvalidCookieRequestException
} from '@exteranto/exceptions'

declare var global: any

export const tests = () => {
  describe('Chrome', () => {
    let cookies

    before(() => {
      Container.bindParam('browser', Browser.CHROME)

      cookies = Container.resolve(Cookies)
    })

    afterEach(() => {
      Container.resolve(Dispatcher).events = {}
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

    it('registers event listener', (done) => {
      global.app.boot()

      Container.resolve(Dispatcher)
        .touch(CookieChangedEvent)
        .addHook((event: CookieChangedEvent) => {
          try {
            expect(event.getCookie()).to.equal('cookie')
            done()
          } catch (e) { done(e) }
        })

      chrome.cookies.onChanged.trigger('cookie')
    })
  })
}
