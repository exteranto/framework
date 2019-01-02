import { expect } from 'chai'
import { safari } from '../../safari'

import { Container } from '@exteranto/ioc'
import { Browser } from '@exteranto/support'

import { BrowserAction } from '../../../src'
import { TabIdUnknownException } from '@exteranto/exceptions'

export const tests = () => {
  describe('Safari', () => {
    let browserAction

    before(() => {
      Container.bindParam('browser', Browser.SAFARI)

      browserAction = Container.resolve(BrowserAction)
    })

    it('Sets a badge text.', async () => {
      const browserWindow = {
        tabs: [
          { eid: 1, meta: { badgeText: 'test' } }
        ]
      }

      safari.extension.toolbarItems = [{ badge: 0, browserWindow }]
      safari.application.activeBrowserWindow = browserWindow
      safari.application.browserWindows = [browserWindow]

      await expect(safari.application.browserWindows[0].tabs[0].meta.badgeText).to.equal('test')
      await expect(browserAction.setText('different', 1)).to.eventually.be.fulfilled
      await expect(safari.application.browserWindows[0].tabs[0].meta.badgeText).to.equal('different')
      await expect(safari.extension.toolbarItems[0].badge).to.equal('different')
    })

    it('Rejects when trying to set a badge text of an unknown tab.', async () => {
      safari.application.browserWindows = [
        {
          tabs: [
            { eid: 2 }
          ]
        }
      ]

      await expect(browserAction.setText('test', 1)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('Gets a badge text.', async () => {
      safari.application.browserWindows = [
        {
          tabs: [
            { eid: 2 }
          ]
        },
        {
          tabs: [
            { eid: 1, meta: { badgeText: 'test' } }
          ]
        }
      ]

      await expect(browserAction.getText(1)).to.eventually.equal('test')
    })

    it('Rejects when trying to get a badge text of an unknown tab.', async () => {
      safari.application.browserWindows = [
        {
          tabs: [
            { eid: 2 }
          ]
        }
      ]

      await expect(browserAction.getText(1)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('Does not support badge color APIs.', async (done) => {
      done()
    })

    it('...', async () => {
      //
    })
  })
}
