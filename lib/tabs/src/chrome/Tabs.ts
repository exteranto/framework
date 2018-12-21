import { Dispatcher, RegistersNativeEvents } from '@exteranto/events'
import { TabInterface } from '../TabInterface'
import { Tabs as AbstractTabs } from '../Tabs'
import { register } from './events'
import { Tab } from './Tab'

export class Tabs extends AbstractTabs implements RegistersNativeEvents {
  /**
   * Returns all tabs that match the provided query.
   *
   * @param {any} query
   * @return {Promise<TabInterface[]>}
   */
  protected filter (query: any = {}) : Promise<TabInterface[]> {
    return new Promise(resolve => chrome.tabs.query(query, (tabs) => {
      resolve(tabs.map(tab => new Tab(tab)))
    }))
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
      chrome.tabs.create({ url, active }, tab => resolve(new Tab(tab)))
    })
  }

  /**
   * Register all native events on the given module.
   *
   * @param {Dispatcher} dispatcher
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    register(dispatcher)
  }
}
