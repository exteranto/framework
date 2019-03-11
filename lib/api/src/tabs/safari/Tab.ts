import { Tabs } from '../Tabs'
import { Autowired } from '@exteranto/core'
import { ResponseHub } from './ResponseHub'
import { Message } from '@internal/messaging'
import { TabInterface } from '../TabInterface'
import { TabIdUnknownException, TabHasNoFaviconException } from '../exceptions'

export class Tab implements TabInterface {

  /**
   * Tabs manager instance.
   */
  @Autowired
  private tabs: Tabs

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
    return this.tab.eid
  }

  /**
   * {@inheritdoc}
   */
  public async url () : Promise<string> {
    if (this.tab.browserWindow === undefined) {
      throw new TabIdUnknownException()
    }

    return this.tab.url
  }

  /**
   * {@inheritdoc}
   */
  public async close () : Promise<void> {
    if (this.tab.browserWindow === undefined) {
      throw new TabIdUnknownException()
    }

    this.tab.close()
  }

  /**
   * {@inheritdoc}
   */
  public async reload () : Promise<TabInterface> {
    if (this.tab.browserWindow === undefined) {
      throw new TabIdUnknownException()
    }

    this.tab.url = this.tab.url

    return this
  }

  /**
   * {@inheritdoc}
   */
  public async duplicate () : Promise<TabInterface> {
    if (this.tab.browserWindow === undefined) {
      throw new TabIdUnknownException()
    }

    return this.tabs.open(this.tab, true)
  }

  /**
   * {@inheritdoc}
   */
  public async activate () : Promise<TabInterface> {
    if (this.tab.browserWindow === undefined) {
      throw new TabIdUnknownException()
    }

    this.tab.activate()

    return this
  }

  /**
   * {@inheritdoc}
   */
  public async pin () : Promise<TabInterface> {
    if (this.tab.browserWindow === undefined) {
      throw new TabIdUnknownException()
    }

    return this
  }

  /**
   * {@inheritdoc}
   */
  public async unpin () : Promise<TabInterface> {
    return this.pin()
  }

  /**
   * {@inheritdoc}
   */
  public async favicon () : Promise<string> {
    throw new TabHasNoFaviconException()
  }

  /**
   * {@inheritdoc}
   */
  public async send (message: Message) : Promise<any>  {
    const { resolvable, id }: any = ResponseHub

    this.tab.dispatchMessage('_', {
      event: message.constructor.name,
      id,
      payload: message.payload,
    })

    return resolvable
  }

  /**
   * {@inheritdoc}
   */
  public raw (key: string) : any {
    return this.tab[key]
  }

}
