import { Dispatcher } from '@exteranto/core'
import { BrowserActionClickedEvent } from '../events'
import { TabIdUnknownException } from '@exteranto/exceptions'
import { BrowserAction as AbstractBrowserAction } from '../BrowserAction'

export class BrowserAction extends AbstractBrowserAction {
  /**
   * @inheritdoc
   */
  public async getBadgeText (tabId: number) : Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.browserAction.getBadgeText({ tabId }, (text) => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve(text)
      })
    }).then(s => s as string)
  }

  /**
   * @inheritdoc
   */
  public async setBadgeText (text: string, tabId: number) : Promise<void> {
    return new Promise((resolve, reject) => {
      (chrome as any).browserAction.setBadgeText({ text, tabId }, () => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve()
      })
    }).then(v => void v)
  }

  /**
   * @inheritdoc
   */
  public async getBadgeColor (tabId: number) : Promise<number[]> {
    return new Promise((resolve, reject) => {
      chrome.browserAction.getBadgeBackgroundColor({ tabId }, (color) => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve(color)
      })
    }).then(cs => cs as number[])
  }

  /**
   * @inheritdoc
   */
  public async setBadgeColor (color: number[], tabId: number) : Promise<void> {
    return new Promise((resolve, reject) => {
      (chrome as any).browserAction.setBadgeBackgroundColor({ color, tabId }, () => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve()
      })
    }).then(v => void v)
  }

  /**
   * @inheritdoc
   */
  public async getTitle (tabId: number) : Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.browserAction.getTitle({ tabId }, (title) => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve(title)
      })
    }).then(s => s as string)
  }

  /**
   * @inheritdoc
   */
  public async setTitle (title: string, tabId: number) : Promise<void> {
    return new Promise((resolve, reject) => {
      (chrome as any).browserAction.setTitle({ title, tabId }, () => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve()
      })
    }).then(v => void v)
  }

  /**
   * @inheritdoc
   */
  public async setIcon (path: string | object, tabId: number) : Promise<void> {
    return new Promise((resolve, reject) => {
      (chrome as any).browserAction.setIcon({ path, tabId }, () => {
        chrome.runtime.lastError ? reject(new TabIdUnknownException()) : resolve()
      })
    }).then(v => void v)
  }

  /**
   * @inheritdoc
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    chrome.browserAction.onClicked.addListener(({ id }) => {
      dispatcher.fire(new BrowserActionClickedEvent(id))
    })
  }
}
