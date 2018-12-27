import { tests as chromeTests } from './ChromeCookies.spec'
import { tests as extensionsTests } from './ExtensionsCookies.spec'
import { tests as safariTests } from './SafariCookies.spec'

import { expect } from 'chai'
import * as sinon from 'sinon'
import * as chrome from 'sinon-chrome'
import { Container } from '@exteranto/ioc'
import { Cookies } from '../../../src/Cookies'
import { Browser } from '@exteranto/support'

describe('Cookies API', () => {
  chromeTests()
  extensionsTests()
  safariTests()

  let cookies

  before(() => {
    Container.bindParam('browser', Browser.CHROME)

    cookies = Container.resolve(Cookies)
  })

  it('populates sets a new cookie', async () => {
    chrome.cookies.getAll.yields([])
    chrome.cookies.set.yields(undefined)

    await expect(cookies.populate({ name: 'cookie' }))
      .not.to.be.eventually.rejected

    sinon.assert.calledOnce(chrome.cookies.getAll)
    sinon.assert.calledOnce(chrome.cookies.set)
  })

  it('populates doesn\'t override existing cookie', async () => {
    chrome.cookies.getAll.yields([{ name: 'cookie' }])
    chrome.cookies.set.yields(undefined)

    await expect(cookies.populate({ name: 'cookie' }))
      .not.to.be.eventually.rejected

    sinon.assert.calledOnce(chrome.cookies.getAll)
    sinon.assert.neverCalledWith(chrome.cookies.set)
  })
})
