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
   * {@inheritdoc}
   */
  public id () : number {
    return this.tab.id
  }

  /**
   * {@inheritdoc}
   */
  public async url () : Promise<string> {
    return browser.tabs.get(this.tab.id)
      .then(({ url }) => url)
  }

  /**
   * {@inheritdoc}
   */
  public async close () : Promise<void> {
    return browser.tabs.remove(this.tab.id)
  }

  /**
   * {@inheritdoc}
   */
  public async reload () : Promise<TabInterface> {
    return browser.tabs.reload(this.tab.id)
      .then(() => this)
  }

  /**
   * {@inheritdoc}
   */
  public async duplicate () : Promise<TabInterface> {
    return browser.tabs.duplicate(this.tab.id)
      .then(tab => new Tab(tab))
  }

  /**
   * {@inheritdoc}
   */
  public async activate () : Promise<TabInterface> {
    return browser.tabs.update(this.tab.id, { active: true })
      .then(() => this)
  }

  /**
   * {@inheritdoc}
   */
  public async pin (pinned: boolean = true) : Promise<TabInterface> {
    return browser.tabs.update(this.tab.id, { pinned })
      .then(() => this)
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

}
