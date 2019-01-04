import { TabIdUnknownException } from '@exteranto/exceptions'
import { BrowserAction as AbstractBrowserAction } from '../BrowserAction'

export class BrowserAction extends AbstractBrowserAction {
  /**
   * @inheritdoc
   */
  public async getBadgeText (tabId: number) : Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.browserAction.getBadgeText({ tabId }, (text) => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve(text)
      })
    })
  }

  /**
   * @inheritdoc
   */
  public async setBadgeText (text: string, tabId: number) : Promise<any> {
    return new Promise((resolve, reject) => {
      (chrome as any).browserAction.setBadgeText({ text, tabId }, () => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve()
      })
    })
  }

  /**
   * @inheritdoc
   */
  public async getBadgeColor (tabId?: number) : Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.browserAction.getBadgeBackgroundColor({ tabId }, (color) => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve(color)
      })
    })
  }

  /**
   * @inheritdoc
   */
  public async setBadgeColor (color: string, tabId?: number) : Promise<any> {
    return new Promise((resolve, reject) => {
      (chrome as any).browserAction.setBadgeBackgroundColor({ color, tabId }, () => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve()
      })
    })
  }

  /**
   * @inheritdoc
   */
  public async getTitle (tabId: number) : Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.browserAction.getTitle({ tabId }, (title) => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve(title)
      })
    })
  }

  /**
   * @inheritdoc
   */
  public async setTitle (title: string, tabId: number) : Promise<any> {
    return new Promise((resolve, reject) => {
      (chrome as any).browserAction.setTitle({ title, tabId }, () => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve()
      })
    })
  }

  /**
   * @inheritdoc
   */
  public async setIcon (path: string | object, tabId: number) : Promise<any> {
    return new Promise((resolve, reject) => {
      (chrome as any).browserAction.setIcon({ path, tabId }, () => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve()
      })
    })
  }
}
