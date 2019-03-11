import { Tabs } from '../Tabs'
import { Autowired } from '@exteranto/core'
import { ResponseHub } from './ResponseHub'
import { Message } from '@internal/messaging'
import { TabInterface } from '../TabInterface'

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
    return this.tab.url
  }

  /**
   * {@inheritdoc}
   */
  public async close () : Promise<void> {
    this.tab.close()
  }

  /**
   * {@inheritdoc}
   */
  public async reload () : Promise<TabInterface> {
    this.tab.url = this.tab.url

    return this
  }

  /**
   * {@inheritdoc}
   */
  public async duplicate () : Promise<TabInterface> {
    return this.tabs.open(this.tab, true)
  }

  /**
   * {@inheritdoc}
   */
  public async activate () : Promise<TabInterface> {
    this.tab.activate()

    return this
  }

  /**
   * {@inheritdoc}
   */
  public async pin () : Promise<TabInterface> {
    return this
  }

  /**
   * {@inheritdoc}
   */
  public async unpin () : Promise<TabInterface> {
    return this
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
