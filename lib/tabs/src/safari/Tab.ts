import { Script } from '@exteranto/support'
import { TabInterface } from '../TabInterface'
import { Autowired } from '@exteranto/ioc'
import { Tabs } from '../Tabs'

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
    const { resolvable, id } = (this.tabs as any).responseHub

    this.tab.dispatchMessage('_', { script: Script.CONTENT, id, event, payload })

    return resolvable
  }

  /**
   * @inheritdoc
   */
  public raw (key: string) : any {
    return this.tab[key]
  }
}
