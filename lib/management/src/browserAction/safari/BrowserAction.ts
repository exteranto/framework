import { TabIdUnknownException } from '@exteranto/exceptions'
import { Listen } from '@exteranto/events'
import { BrowserAction as AbstractBrowserAction } from '../BrowserAction'

declare var safari: any

export class BrowserAction extends AbstractBrowserAction {
  /**
   * @inheritdoc
   */
  public async getText (tabId: number) : Promise<any> {
    const tab: any = this.getAllTabs().find(t => t.eid === tabId)

    if (!tab) {
      return Promise.reject(new TabIdUnknownException())
    }

    return tab.meta.badgeText || ''
  }

  /**
   * @inheritdoc
   */
  public async setText (text: string, tabId: number) : Promise<any> {
    const tab: any = this.getAllTabs().find(t => t.eid === tabId)

    if (!tab) {
      return Promise.reject(new TabIdUnknownException())
    }

    tab.meta.badgeText = text

    this.refreshBadge(tabId)
  }

  /**
   * @inheritdoc
   */
  public async getColor (tabId?: number) : Promise<any> {
    // Safari does not provide us with APIs to change the badge background color
    // or retrieve it. It's always red. To be in sync with the other APIs, we'll
    // just hardcode red.
    return Promise.resolve('#ff0000')
  }

  /**
   * @inheritdoc
   */
  public async setColor (color: string, tabId?: number) : Promise<any> {
    // Safari does not provide us with APIs to change the badge background color
    // or retrieve it. It's always red. To be in sync with the other APIs, we'll
    // just resolve the promise.
    return Promise.resolve()
  }

  /**
   * @inheritdoc
   */
  public async getTitle (tabId: number) : Promise<any> {
    return Promise.reject('To be implemented.')
  }

  /**
   * @inheritdoc
   */
  public async setTitle (title: string, tabId: number) : Promise<any> {
    return Promise.reject('To be implemented.')
  }

  /**
   * @inheritdoc
   */
  public async setIcon (path: string | object, tabId: number) : Promise<any> {
    return Promise.reject('To be implemented.')
  }

  /**
   * Refresh the badge based on the meta data stored on tab objects.
   *
   * @param {number} info
   */
  @Listen('app.tabs.activated')
  private refreshBadge (tabId: number) : void {
    this.getAllTabs().forEach((tab) => {
      if (tab.eid !== tabId) {
        return
      }

      safari.extension.toolbarItems.forEach((item) => {
        if (item.browserWindow === safari.application.activeBrowserWindow) {
          item.badge = tab.meta.badgeText || 0
        }
      })
    })
  }

  /**
   * Return all currently open tabs.
   *
   * @return {any[]}
   */
  private getAllTabs () : any[] {
    return safari.application.browserWindows.reduce((carry, item) => {
      return carry.concat(item.tabs || [])
    }, [])
  }
}
