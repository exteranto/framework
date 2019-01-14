import { expect } from 'chai'
import * as sinon from 'sinon'
import * as browser from 'sinon-chrome/extensions'
import { Container } from '@exteranto/ioc'
import { Cookies } from '../../../src/Cookies'
import { Browser } from '@exteranto/support'
import { Dispatcher } from '@exteranto/events'
import {
  EmptyResponseException,
  InvalidCookieRequestException
} from '@exteranto/exceptions'

declare var global: any

export const tests = () => {
  describe('Extensions', () => {
    let cookies

    before(() => {
      Container.bindParam('browser', Browser.EXTENSIONS)

      cookies = Container.resolve(Cookies)
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

    it('registers event listener', async () => {
      await global.app.boot()

      const spy = sinon.spy()
      const handle = payload => new Promise((resolve) => {
        spy(payload)
        resolve()
      })

      Container.resolve(Dispatcher)
        .touch('app.cookies.changed')
        .addHook(handle)

      browser.cookies.onChanged.trigger('cookie')

      await handle

      sinon.assert.calledOnce(spy)
      sinon.assert.calledWith(spy, 'cookie')
    })
  })
}
