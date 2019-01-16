import { expect } from 'chai'

import { Container } from '@exteranto/core'
import { Browser } from '@exteranto/core'

import { BrowserAction } from '../../../src'
import { TabIdUnknownException } from '@exteranto/exceptions'

declare var safari: any

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
      await expect(browserAction.setBadgeText('different', 1)).to.eventually.be.fulfilled
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

      await expect(browserAction.setBadgeText('test', 1)).to.eventually.be.rejectedWith(TabIdUnknownException)
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

      await expect(browserAction.getBadgeText(1)).to.eventually.equal('test')
    })

    it('Rejects when trying to get a badge text of an unknown tab.', async () => {
      safari.application.browserWindows = [
        {
          tabs: [
            { eid: 2 }
          ]
        }
      ]

      await expect(browserAction.getBadgeText(1)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('Does not support badge color APIs.', async (done) => {
      done()
    })

    it('Sets the extension title.', async () => {
      const browserWindow = {
        tabs: [
          { eid: 1, meta: { title: 'test' } }
        ]
      }

      safari.extension.toolbarItems = [{ label: '', browserWindow }]
      safari.application.activeBrowserWindow = browserWindow
      safari.application.browserWindows = [browserWindow]

      await expect(safari.application.browserWindows[0].tabs[0].meta.title).to.equal('test')
      await expect(browserAction.setTitle('different', 1)).to.eventually.be.fulfilled
      await expect(safari.application.browserWindows[0].tabs[0].meta.title).to.equal('different')
      await expect(safari.extension.toolbarItems[0].label).to.equal('different')
    })

    it('Rejects when trying to set a title text in an unknown tab.', async () => {
      safari.application.browserWindows = [
        {
          tabs: [
            { eid: 2 }
          ]
        }
      ]

      await expect(browserAction.setTitle('test', 1)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('Retruns the extension title.', async () => {
      safari.application.browserWindows = [
        {
          tabs: [
            { eid: 2 }
          ]
        },
        {
          tabs: [
            { eid: 1, meta: { title: 'test' } }
          ]
        }
      ]

      await expect(browserAction.getTitle(1)).to.eventually.equal('test')
    })

    it('Rejects when trying to get a title text in an unknown tab.', async () => {
      safari.application.browserWindows = [
        {
          tabs: [
            { eid: 2 }
          ]
        }
      ]

      await expect(browserAction.getTitle(1)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('Sets the extension icon.', async () => {
      const browserWindow = {
        tabs: [
          { eid: 1, meta: { icon: 'test.png' } }
        ]
      }

      safari.extension.toolbarItems = [{ image: '', browserWindow }]
      safari.application.activeBrowserWindow = browserWindow
      safari.application.browserWindows = [browserWindow]

      await expect(safari.application.browserWindows[0].tabs[0].meta.icon).to.equal('test.png')
      await expect(browserAction.setIcon('different.png', 1)).to.eventually.be.fulfilled
      await expect(safari.application.browserWindows[0].tabs[0].meta.icon).to.equal('different.png')
      await expect(safari.extension.toolbarItems[0].image).to.equal('different.png')
    })

    it('Sets the extension icon as an object.', async () => {
      const browserWindow = {
        tabs: [
          { eid: 1, meta: { icon: 'test.png' } }
        ]
      }

      safari.extension.toolbarItems = [{ image: '', browserWindow }]
      safari.application.activeBrowserWindow = browserWindow
      safari.application.browserWindows = [browserWindow]

      await expect(safari.application.browserWindows[0].tabs[0].meta.icon).to.equal('test.png')
      await expect(browserAction.setIcon({ 16: 'different.png' }, 1)).to.eventually.be.fulfilled
      await expect(safari.application.browserWindows[0].tabs[0].meta.icon).to.equal('different.png')
      await expect(safari.extension.toolbarItems[0].image).to.equal('different.png')
    })

    it('Rejects when trying to set a icon text in an unknown tab.', async () => {
      safari.application.browserWindows = [
        {
          tabs: [
            { eid: 2 }
          ]
        }
      ]

      await expect(browserAction.setIcon('test', 1)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })
  })
}
