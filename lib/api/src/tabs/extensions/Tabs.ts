import { Dispatcher, RegistersNativeEvents } from '@exteranto/core'
import { TabIdUnknownException } from '@exteranto/exceptions'
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
    return browser.tabs.query(query)
      .then(tabs => tabs.map(tab => new Tab(tab)))
  }

  /**
   * Opens a brand new tab with specified parameters.
   *
   * @param {string} url
   * @param {boolean} active
   * @return {Promise<TabInterface>}
   */
  public open (url: string, active: boolean = false) : Promise<TabInterface> {
    return browser.tabs.create({ url, active })
      .then(tab => new Tab(tab))
  }

  /**
   * @inheritdoc
   */
  public async get (id: number) : Promise<TabInterface> {
    return browser.tabs.get(id)
      .then(tab => new Tab(tab))
      .catch(() => Promise.reject(new TabIdUnknownException()))
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
