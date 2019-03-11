import { Message } from '@internal/messaging'
import { TabInterface } from '../TabInterface'
import { TabIdUnknownException, TabHasNoFaviconException } from '@internal/tabs/exceptions'

import Port = chrome.runtime.Port

export class Tab implements TabInterface {

  /**
   * @param tab Tab info object
   */
  constructor (private tab: any) {
    //
  }

  /**
   * {@inheritdoc}
   */
  public id () : number {
    return this.tab.id
  }

  /**
   * {@inheritdoc}
   */
  public async url () : Promise<string> {
    return this.info().then(tab => tab.url)
  }

  /**
   * {@inheritdoc}
   */
  public close () : Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.tabs.remove(this.tab.id, () => {
        chrome.runtime.lastError
          ? reject(new TabIdUnknownException())
          : resolve()
      })
    })
  }

  /**
   * {@inheritdoc}
   */
  public reload () : Promise<TabInterface> {
    return new Promise((resolve, reject) => {
      chrome.tabs.reload(this.tab.id, {}, () => {
        chrome.runtime.lastError
          ? reject(new TabIdUnknownException())
          : resolve(this)
      })
    })
  }

  /**
   * {@inheritdoc}
   */
  public duplicate () : Promise<TabInterface> {
    return new Promise((resolve, reject) => {
      chrome.tabs.duplicate(this.tab.id, (tab) => {
        chrome.runtime.lastError
          ? reject(new TabIdUnknownException())
          : resolve(new Tab(tab))
      })
    })
  }

  /**
   * {@inheritdoc}
   */
  public activate () : Promise<TabInterface> {
    return new Promise((resolve, reject) => {
      chrome.tabs.update(
        this.tab.id,
        { active: true },
        () => {
          chrome.runtime.lastError
            ? reject(new TabIdUnknownException())
            : resolve(this)
        },
      )
    })
  }

  /**
   * {@inheritdoc}
   */
  public pin (pinned: boolean = true) : Promise<TabInterface> {
    return new Promise((resolve, reject) => {
      chrome.tabs.update(
        this.tab.id,
        { pinned },
        () => {
          chrome.runtime.lastError
            ? reject(new TabIdUnknownException())
            : resolve(this)
        },
      )
    })
  }

  /**
   * {@inheritdoc}
   */
  public unpin () : Promise<TabInterface> {
    return this.pin(false)
  }

  /**
   * {@inheritdoc}
   */
  public async favicon () : Promise<string> {
    return this.info().then((tab) => {
      if (!tab.favIconUrl) {
        throw new TabHasNoFaviconException()
      }

      return tab.favIconUrl
    })
  }

  /**
   * {@inheritdoc}
   */
  public send (message: Message) : Promise<any> {
    const port: Port = chrome.tabs.connect(this.tab.id)

    port.postMessage({
      event: message.constructor.name,
      payload: message.payload,
    })

    return new Promise((resolve, reject) => {
      const respond: (response: any) => void = response => response.ok ? resolve(response.body) : reject(response.body)

      // This is triggered upon receiving a response from the listener.
      port.onMessage.addListener(respond)
    })
  }

  /**
   * {@inheritdoc}
   */
  public raw (key: string) : any {
    return this.tab[key]
  }

  /**
   * Calls the chrome tab APIs to get information about current tab.
   *
   * @return Resolves with chrome tab data object
   * @throws {TabIdUnknownException}
   */
  private info () : Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
      chrome.tabs.get(this.tab.id, (tab) => {
        chrome.runtime.lastError
          ? reject(new TabIdUnknownException())
          : resolve(tab)
      })
    })
  }

}
