import { expect } from 'chai'
import * as browser from 'sinon-chrome/extensions'

import { Container } from '@exteranto/ioc'
import { Browser } from '@exteranto/support'

import { BrowserAction } from '../../../src'
import { TabIdUnknownException } from '@exteranto/exceptions'

export const extensionsTests = () => {
  describe('Extensions', () => {
    let browserAction

    before(() => {
      Container.bindParam('browser', Browser.EXTENSIONS)

      browserAction = Container.resolve(BrowserAction)
    })

    it('Sets a badge text.', async () => {
      browser.browserAction.setBadgeText.resolves(undefined)

      await expect(browserAction.setText('test', 1)).to.eventually.be.fulfilled
    })

    it('Rejects when trying to set a badge text of an unknown tab.', async () => {
      browser.browserAction.setBadgeText.rejects(TabIdUnknownException)

      await expect(browserAction.setText('test', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('Gets a badge text.', async () => {
      browser.browserAction.getBadgeText.resolves('test')

      await expect(browserAction.getText(1)).to.eventually.equal('test')
    })

    it('Rejects when trying to get a badge text of an unknown tab.', async () => {
      browser.browserAction.getBadgeText.rejects(TabIdUnknownException)

      await expect(browserAction.getText('test', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('Sets a badge background color.', async () => {
      browser.browserAction.setBadgeBackgroundColor.resolves(undefined)

      await expect(browserAction.setColor('#000', 1)).to.eventually.be.fulfilled
    })

    it('Rejects when trying to set a badge background color of an unknown tab.', async () => {
      browser.browserAction.setBadgeBackgroundColor.rejects(TabIdUnknownException)

      await expect(browserAction.setColor('#000', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('Gets a badge background color.', async () => {
      browser.browserAction.getBadgeBackgroundColor.resolves('#000')

      await expect(browserAction.getColor(1)).to.eventually.equal('#000')
    })

    it('Rejects when trying to get a badge background color of an unknown tab.', async () => {
      browser.browserAction.getBadgeBackgroundColor.rejects(TabIdUnknownException)

      await expect(browserAction.getColor('#000', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('...', async () => {
      //
    })
  })
}
