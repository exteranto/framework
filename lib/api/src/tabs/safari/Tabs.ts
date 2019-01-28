import { Tab } from './Tab'
import { register } from './events'
import { TabInterface } from '../TabInterface'
import { Tabs as AbstractTabs } from '../Tabs'
import { Dispatcher, RegistersNativeEvents } from '@exteranto/core'
import { TabIdUnknownException } from '@exteranto/exceptions'

export class Tabs extends AbstractTabs implements RegistersNativeEvents {

  /**
   * @inheritdoc
   */
  protected async filter (query: any = {}) : Promise<TabInterface[]> {
    return ['active', 'currentWindow', 'title', 'index', 'windowId']
      .reduce((tabs, condition) => {
        return query[condition] !== undefined
          ? tabs.filter(tab => tab.raw('meta')[condition] === query[condition])
          : tabs
      }, this.getAllTabs())
  }

  /**
   * @inheritdoc
   */
  public async open (url: string, active: boolean = false) : Promise<TabInterface> {
    const tab: any = safari.application.activeBrowserWindow.openTab()

    tab.url = url

    if (active) {
      tab.activate()
    }

    return new Tab(tab)
  }

  /**
   * @inheritdoc
   */
  public async get (id: number) : Promise<TabInterface> {
    const tab: TabInterface = this.getAllTabs().find(t => t.id() === id)

    if (!tab) {
      throw new TabIdUnknownException()
    }

    return tab
  }

  /**
   * @inheritdoc
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    register(dispatcher)
  }

  /**
   * Collects all safari tabs into one array with
   * additional informationabout the tab.
   *
   * @return Array of tab instances
   */
  private getAllTabs () : Tab[] {
    return safari.application.browserWindows.reduce((tabs, window) => {
      window.tabs.forEach((tab, index) => {
        tab.meta.active = tab === window.activeTab
        tab.meta.currentWindow = window === safari.application.activeBrowserWindow
        tab.meta.index = index
        tab.meta.windowId = window.eid
      })

      return [...tabs, ...window.tabs]
    }, []).map(tab => new Tab(tab))
  }

}
