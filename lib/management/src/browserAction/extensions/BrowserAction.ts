import { TabIdUnknownException } from '@exteranto/exceptions'
import { BrowserAction as AbstractBrowserAction } from '../BrowserAction'

export class BrowserAction extends AbstractBrowserAction {
  /**
   * @inheritdoc
   */
  public async getText (tabId: number) : Promise<any> {
    return browser.browserAction.getBadgeText({ tabId })
      .catch(() => Promise.reject(new TabIdUnknownException()))
  }

  /**
   * @inheritdoc
   */
  public async setText (text: string, tabId: number) : Promise<any> {
    return (browser as any).browserAction.setBadgeText({ text, tabId })
      .catch(() => Promise.reject(new TabIdUnknownException()))
  }

  /**
   * @inheritdoc
   */
  public async getColor (tabId?: number) : Promise<any> {
    return browser.browserAction.getBadgeBackgroundColor({ tabId })
      .catch(() => Promise.reject(new TabIdUnknownException()))
  }

  /**
   * @inheritdoc
   */
  public async setColor (color: string, tabId?: number) : Promise<any> {
    return (browser as any).browserAction.setBadgeBackgroundColor({ color, tabId })
      .catch(() => Promise.reject(new TabIdUnknownException()))
  }

  /**
   * @inheritdoc
   */
  public async getTitle (tabId: number) : Promise<any> {
    return browser.browserAction.getTitle({ tabId })
      .catch(() => Promise.reject(new TabIdUnknownException()))
  }

  /**
   * @inheritdoc
   */
  public async setTitle (title: string, tabId: number) : Promise<any> {
    try {
      browser.browserAction.setTitle({ title, tabId })
    } catch {
      return Promise.reject(new TabIdUnknownException())
    }
  }

  /**
   * @inheritdoc
   */
  public async setIcon (path: string | object, tabId: number) : Promise<any> {
    return browser.browserAction.setIcon({ path, tabId })
      .catch(() => Promise.reject(new TabIdUnknownException()))
  }
}
