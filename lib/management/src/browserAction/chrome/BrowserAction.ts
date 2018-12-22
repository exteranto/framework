import { TabIdUnknownException } from '@exteranto/exceptions'
import { BrowserAction as AbstractBrowserAction } from '../BrowserAction'

export class BrowserAction extends AbstractBrowserAction {
  /**
   * @inheritdoc
   */
  public async getText (tabId: number) : Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.browserAction.getBadgeText({ tabId }, (text) => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve(text)
      })
    })
  }

  /**
   * @inheritdoc
   */
  public async setText (text: string, tabId: number) : Promise<any> {
    return new Promise((resolve, reject) => {
      (chrome as any).browserAction.setBadgeText({ text, tabId }, () => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve()
      })
    })
  }

  /**
   * @inheritdoc
   */
  public async getColor (tabId?: number) : Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.browserAction.getBadgeBackgroundColor({ tabId }, (color) => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve(color)
      })
    })
  }

  /**
   * @inheritdoc
   */
  public async setColor (color: string, tabId?: number) : Promise<any> {
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

  /**
   * @inheritdoc
   */
  public async getPopup (tabId: number) : Promise<any> {
    return new Promise((resolve, reject) => {
      (chrome as any).browserAction.getPopup({ tabId }, (popup) => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve(popup)
      })
    })
  }

  /**
   * @inheritdoc
   */
  public async setPopup (popup: string, tabId: number) : Promise<any> {
    return new Promise((resolve, reject) => {
      (chrome as any).browserAction.setPopup({ popup, tabId }, () => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve()
      })
    })
  }
}
