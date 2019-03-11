import { Dispatcher } from '@exteranto/core'
import { TabActivatedEvent } from '@internal/tabs'
import { BrowserActionClickedEvent } from '../events'
import { TabIdUnknownException } from '@internal/tabs/exceptions'
import { BrowserAction as AbstractBrowserAction } from '../BrowserAction'

declare var safari: any

export class BrowserAction extends AbstractBrowserAction {

  /**
   * {@inheritdoc}
   */
  public async getBadgeText (tabId: number) : Promise<string> {
    const tab: any = this.getAllTabs().find(t => t.eid === tabId)

    if (!tab) {
      return Promise.reject(new TabIdUnknownException())
    }

    return tab.meta.badgeText || ''
  }

  /**
   * {@inheritdoc}
   */
  public async setBadgeText (text: string, tabId: number) : Promise<void> {
    const tab: any = this.getAllTabs().find(t => t.eid === tabId)

    if (!tab) {
      return Promise.reject(new TabIdUnknownException())
    }

    tab.meta.badgeText = text

    this.refreshBadge(tabId)
  }

  /**
   * {@inheritdoc}
   */
  public async getBadgeColor (_: number) : Promise<any> {
    // Safari does not provide us with APIs to change the badge background color
    // or retrieve it. It's always red. To be in sync with the other APIs, we'll
    // just hardcode red.
    return Promise.resolve([255, 0, 0, 255])
  }

  /**
   * {@inheritdoc}
   */
  public async setBadgeColor () : Promise<any> {
    // Safari does not provide us with APIs to change the badge background color
    // or retrieve it. It's always red. To be in sync with the other APIs, we'll
    // just resolve the promise.
    return Promise.resolve()
  }

  /**
   * {@inheritdoc}
   */
  public async getTitle (tabId: number) : Promise<string> {
    const tab: any = this.getAllTabs().find(t => t.eid === tabId)

    if (!tab) {
      return Promise.reject(new TabIdUnknownException())
    }

    return tab.meta.title || ''
  }

  /**
   * {@inheritdoc}
   */
  public async setTitle (title: string, tabId: number) : Promise<void> {
    const tab: any = this.getAllTabs().find(t => t.eid === tabId)

    if (!tab) {
      return Promise.reject(new TabIdUnknownException())
    }

    tab.meta.title = title

    this.refreshBadge(tabId)
  }

  /**
   * {@inheritdoc}
   */
  public async setIcon (path: string | object, tabId: number) : Promise<void> {
    const tab: any = this.getAllTabs().find(t => t.eid === tabId)

    if (!tab) {
      return Promise.reject(new TabIdUnknownException())
    }

    tab.meta.icon = typeof path === 'string' ? path : path[Object.keys(path)[0]]

    this.refreshBadge(tabId)
  }

  /**
   * {@inheritdoc}
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    dispatcher
      .touch(TabActivatedEvent)
      .addHook((event: TabActivatedEvent) => this.refreshBadge(event.tabId))

    safari.application.addEventListener('command', ({ command }) => {
      if (command !== 'openOverlay') {
        return
      }

      dispatcher.fire(new BrowserActionClickedEvent(
        safari.application.activeBrowserWindow.activeTab.eid,
      ))
    }, false)
  }

  /**
   * Refresh the badge based on the meta data stored on tab objects.
   *
   * @param tabId Id of the target tab
   */
  private refreshBadge (tabId: number) : void {
    this.getAllTabs().forEach((tab) => {
      if (tab.eid !== tabId) {
        return
      }

      safari.extension.toolbarItems.forEach((item) => {
        if (item.browserWindow === safari.application.activeBrowserWindow) {
          item.badge = tab.meta.badgeText || 0
          item.label = tab.meta.title || ''
          item.paletteLabel = tab.meta.title || ''
          item.toolTip = tab.meta.title || ''
          item.image = tab.meta.icon || ''
        }
      })
    })
  }

  /**
   * Return all currently open tabs.
   *
   * @return Array of tab objects
   */
  private getAllTabs () : any[] {
    return safari.application.browserWindows.reduce((carry, item) => {
      return carry.concat(item.tabs || [])
    }, [])
  }

}
