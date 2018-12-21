import { Script } from '@exteranto/support'
import { TabInterface } from '../TabInterface'
import { Autowired } from '@exteranto/ioc'
import { Tabs } from '../Tabs'

declare var safari: any

export class Tab implements TabInterface {
  /**
   * Tabs manager instance.
   *
   * @var {Tabs} tabs
   */
  @Autowired
  private tabs: Tabs

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
    return this.tab.eid
  }

  /**
   * @inheritdoc
   */
  public async url () : Promise<string> {
    return this.tab.url
  }

  /**
   * @inheritdoc
   */
  public async close () : Promise<void> {
    this.tab.close()
  }

  /**
   * @inheritdoc
   */
  public async reload () : Promise<TabInterface> {
    this.tab.url = this.tab.url

    return this
  }

  /**
   * @inheritdoc
   */
  public duplicate () : Promise<TabInterface> {
    return this.tabs.open(this.tab, true)
  }

  /**
   * @inheritdoc
   */
  public async activate () : Promise<TabInterface> {
    this.tab.activate()

    return this
  }

  /**
   * @inheritdoc
   */
  public send (event: string, payload?: object) : Promise<any>  {
    this.tab.dispatchMessage('_', { script: Script.CONTENT, event, payload })

    return new Promise((resolve) => {
      safari.application.addEventListener('message', (response) => {
        // If the message is a response and the event name matches, resolve the
        // promise.
        if (response.name === '_response_' && response.message.event === event) {
          return resolve(response.message.payload)
        }
      })
    })
  }

  /**
   * @inheritdoc
   */
  public raw (key: string) : any {
    return this.tab[key]
  }
}
