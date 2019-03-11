import { Message } from '@internal/messaging'
import { TabInterface } from '../TabInterface'
import { TabIdUnknownException, TabHasNoFaviconException } from '../exceptions'

import Port = browser.runtime.Port

export class Tab implements TabInterface {

  /**
   * Class constructor.
   *
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
  public async close () : Promise<void> {
    return browser.tabs.remove(this.tab.id)
      .catch(() => Promise.reject(new TabIdUnknownException()))
  }

  /**
   * {@inheritdoc}
   */
  public async reload () : Promise<TabInterface> {
    return browser.tabs.reload(this.tab.id)
      .then(() => this)
      .catch(() => Promise.reject(new TabIdUnknownException()))
  }

  /**
   * {@inheritdoc}
   */
  public async duplicate () : Promise<TabInterface> {
    return browser.tabs.duplicate(this.tab.id)
      .then(tab => new Tab(tab))
      .catch(() => Promise.reject(new TabIdUnknownException()))
  }

  /**
   * {@inheritdoc}
   */
  public async activate () : Promise<TabInterface> {
    return browser.tabs.update(this.tab.id, { active: true })
      .then(() => this)
      .catch(() => Promise.reject(new TabIdUnknownException()))
  }

  /**
   * {@inheritdoc}
   */
  public async pin (pinned: boolean = true) : Promise<TabInterface> {
    return browser.tabs.update(this.tab.id, { pinned })
      .then(() => this)
      .catch(() => Promise.reject(new TabIdUnknownException()))
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
  public async send (message: Message) : Promise<any> {
    const port: Port = browser.tabs.connect(this.tab.id)

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
   * Calls the browser tab APIs to get information about current tab.
   *
   * @return Resolves with browser tab data object
   * @throws {TabIdUnknownException}
   */
  private async info () : Promise<browser.tabs.Tab> {
    return browser.tabs.get(this.tab.id)
      .catch(() => Promise.reject(new TabIdUnknownException()))
  }

}
