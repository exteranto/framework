import { Message } from '@exteranto/messaging'
import { TabInterface } from '../TabInterface'
import Port = chrome.runtime.Port

export class Tab implements TabInterface {
  /**
   * Class constructor.
   *
   * @param {any} tab
   */
  constructor (private tab: any) {
    //
  }

  /**
   * @inheritdoc
   */
  public id () : number {
    return this.tab.id
  }

  /**
   * @inheritdoc
   */
  public async url () : Promise<string> {
    return new Promise(resolve => chrome.tabs.get(this.tab.id, resolve))
      .then(({ url }) => url)
  }

  /**
   * @inheritdoc
   */
  public close () : Promise<void> {
    return new Promise((resolve) => {
      chrome.tabs.remove(this.tab.id, resolve)
    })
  }

  /**
   * @inheritdoc
   */
  public reload () : Promise<TabInterface> {
    return new Promise((resolve) => {
      chrome.tabs.reload(this.tab.id, {}, () => resolve(this))
    })
  }

  /**
   * @inheritdoc
   */
  public duplicate () : Promise<TabInterface> {
    return new Promise((resolve) => {
      chrome.tabs.duplicate(this.tab.id, tab => resolve(new Tab(tab)))
    })
  }

  /**
   * @inheritdoc
   */
  public activate () : Promise<TabInterface> {
    return new Promise(resolve => {
      chrome.tabs.update(
        this.tab.id,
        { active: true },
        () => resolve(this),
      )
    })
  }

  /**
   * @inheritdoc
   */
  public send (message: Message) : Promise<any> {
    const port: Port = chrome.tabs.connect(this.tab.id)

    port.postMessage({
      event: message.constructor.name,
      payload: message.payload
    })

    return new Promise((resolve) => {
      // This is triggered upon receiving a response from the listener.
      port.onMessage.addListener(resolve)
    })
  }

  /**
   * @inheritdoc
   */
  public raw (key: string) : any {
    return this.tab[key]
  }
}
