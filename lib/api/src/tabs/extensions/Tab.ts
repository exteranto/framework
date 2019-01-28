import { Message } from '@internal/messaging'
import { TabInterface } from '../TabInterface'
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
   * @inheritdoc
   */
  public id () : number {
    return this.tab.id
  }

  /**
   * @inheritdoc
   */
  public async url () : Promise<string> {
    return browser.tabs.get(this.tab.id)
      .then(({ url }) => url)
  }

  /**
   * @inheritdoc
   */
  public close () : Promise<void> {
    return browser.tabs.remove(this.tab.id)
  }

  /**
   * @inheritdoc
   */
  public reload () : Promise<TabInterface> {
    return browser.tabs.reload(this.tab.id)
      .then(() => this)
  }

  /**
   * @inheritdoc
   */
  public duplicate () : Promise<TabInterface> {
    return browser.tabs.duplicate(this.tab.id)
      .then(tab => new Tab(tab))
  }

  /**
   * @inheritdoc
   */
  public activate () : Promise<TabInterface> {
    return browser.tabs.update(this.tab.id, { active: true })
      .then(() => this)
  }

  /**
   * @inheritdoc
   */
  public send (message: Message) : Promise<any> {
    const port: Port = browser.tabs.connect(this.tab.id)

    port.postMessage({
      event: message.constructor.name,
      payload: message.payload,
    })

    return new Promise((resolve, reject) => {
      const respond: (response: any) => any = response => response.ok ? resolve(response.body) : reject(response.body)

      // This is triggered upon receiving a response from the listener.
      port.onMessage.addListener(respond)
    })
  }

  /**
   * @inheritdoc
   */
  public raw (key: string) : any {
    return this.tab[key]
  }
}
