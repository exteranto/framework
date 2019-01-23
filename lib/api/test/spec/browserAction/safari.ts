import { expect } from 'chai'
import { Dispatcher } from '@exteranto/core'
import { TabIdUnknownException } from '@exteranto/exceptions'
import { mock, instance, verify, deepEqual, when, anything } from 'ts-mockito'
import { BrowserAction, BrowserActionClickedEvent } from '@internal/browserAction'
import { BrowserAction as SafariBrowserAction } from '@internal/browserAction/safari/BrowserAction'

export default ({ safari }) => {
  let browserAction: BrowserAction
  let dispatcher: Dispatcher

  before(() => {
    dispatcher = mock(Dispatcher)
    browserAction = new SafariBrowserAction
  })

  it('sets a badge text.', async () => {
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

  it('rejects when trying to set a badge text of an unknown tab.', async () => {
    safari.application.browserWindows = [
      {
        tabs: [
          { eid: 2 }
        ]
      }
    ]

    await expect(browserAction.setBadgeText('test', 1)).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

  it('gets a badge text.', async () => {
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

  it('rejects when trying to get a badge text of an unknown tab.', async () => {
    safari.application.browserWindows = [
      {
        tabs: [
          { eid: 2 }
        ]
      }
    ]

    await expect(browserAction.getBadgeText(1)).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

  it('does not support badge color APIs.', async (done) => {
    done()
  })

  it('sets the extension title.', async () => {
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

  it('rejects when trying to set a title text in an unknown tab.', async () => {
    safari.application.browserWindows = [
      {
        tabs: [
          { eid: 2 }
        ]
      }
    ]

    await expect(browserAction.setTitle('test', 1)).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

  it('retruns the extension title.', async () => {
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

  it('rejects when trying to get a title text in an unknown tab.', async () => {
    safari.application.browserWindows = [
      {
        tabs: [
          { eid: 2 }
        ]
      }
    ]

    await expect(browserAction.getTitle(1)).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

  it('sets the extension icon.', async () => {
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

  it('sets the extension icon as an object.', async () => {
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

  it('rejects when trying to set a icon text in an unknown tab.', async () => {
    safari.application.browserWindows = [
      {
        tabs: [
          { eid: 2 }
        ]
      }
    ]

    await expect(browserAction.setIcon('test', 1)).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

  it('registers badge click event.', () => {
    safari.application.activeBrowserWindow.activeTab = { eid: 2 },
    safari.application.addEventListener = (_, l) => l({ command: 'openOverlay' })

    when(dispatcher.touch(anything())).thenReturn({ addHook: () => {} } as any)

    browserAction.registerEvents(instance(dispatcher))

    verify(dispatcher.fire(deepEqual(new BrowserActionClickedEvent(2)))).once()
  })
}
