import { Tab } from './Tab'
import { register } from './events'
import { TabInterface } from '../TabInterface'
import { Tabs as AbstractTabs } from '../Tabs'
import { Dispatcher, RegistersNativeEvents } from '@exteranto/core'
import { TabIdUnknownException } from '@exteranto/exceptions'

declare var safari: any

export class Tabs extends AbstractTabs implements RegistersNativeEvents {

  /**
   * Returns all tabs that match the provided query.
   *
   * @param {any} query
   * @return {Promise<TabInterface[]>}
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
   * Opens a brand new tab with specified parameters.
   *
   * @param {string} url
   * @param {boolean} active
   * @return {Promise<TabInterface>}
   */
  public open (url: string, active: boolean = false) : Promise<TabInterface> {
    return new Promise((resolve) => {
      const tab: any = safari.application.activeBrowserWindow.openTab()

      tab.url = url

      if (active) {
        tab.activate()
      }

      resolve(new Tab(tab))
    })
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
   * Register all native events on the given module.
   *
   * @param {Dispatcher} dispatcher
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    register(dispatcher)
  }

  /**
   * Collects all safari tabs into one array with
   * additional informationabout the tab.
   *
   * @return {Tab[]}
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
