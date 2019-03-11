import { TabInterface } from './TabInterface'
import { NoActiveTabException } from './exceptions'
import { Dispatcher, RegistersNativeEvents } from '@exteranto/core'

export abstract class Tabs implements RegistersNativeEvents {

  /**
   * Returns the active tab instance.
   *
   * @return Tab instance
   * @throws {NoActiveTabException}
   */
  public async active () : Promise<TabInterface> {
    const tabs: TabInterface[] = await this.query({ active: true, currentWindow: true })

    if (tabs.length === 0) {
      throw new NoActiveTabException()
    }

    return tabs.pop()
  }

  /**
   * Returns all the tabs that are open at the moment.
   *
   * @return Array of tab instances
   */
  public async all () : Promise<TabInterface[]> {
    return this.query({})
  }

  /**
   * Returns all the tabs that are open at the moment in the current window.
   *
   * @return Array of tab instances
   */
  public async allInCurrentWindow () : Promise<TabInterface[]> {
    return this.query({ currentWindow: true })
  }

  /**
   * Returns all the tabs that are pinned.
   *
   * @return Array of tab instances
   */
  public async pinned () : Promise<TabInterface[]> {
    return this.query({ pinned: true })
  }

  /**
   * Returns all tabs that match the provided url.
   *
   * @param url Exact match or pattern to match
   * @return Array of tab instances
   */
  public async withUrl (url: RegExp|string) : Promise<TabInterface[]> {
    return this.query({ url })
  }

  /**
   * Returns all tabs that match the provided query
   * and filters url via regex rather than match pattern.
   * Queries standard parameters on tab instance.
   *
   * @param query Query object
   * @return Array of tab instances
   */
  public async query (query: any) : Promise<TabInterface[]> {
    const url: any = query.url
    delete query.url

    let tabs: TabInterface[] = await this.filter(query)

    if (url !== undefined) {
      const patterns: any[] = Array.isArray(url) ? url : [url]

      tabs = tabs.filter((tab) => {
        return patterns.some(
          pattern => new RegExp(pattern).test(tab.raw('url')),
        )
      })
    }

    return tabs
  }

  /**
   * Gets tab by id.
   *
   * @return Tab instance
   */
  public abstract async get (id: number) : Promise<TabInterface>

  /**
   * Returns all tabs that match the provided query.
   *
   * @param query Query object
   * @return Array of tab instances
   */
  protected abstract async filter (query: any) : Promise<TabInterface[]>

  /**
   * Opens a brand new tab with specified parameters.
   *
   * @param url Valid url
   * @param active Whether the tab should be activate
   * @return Tab instance
   */
  public abstract async open (url: string, active?: boolean) : Promise<TabInterface>

  /**
   * Register all native events on the given module.
   *
   * @param dispatcher Dispatcher resolved from container
   */
  public abstract registerEvents (dispatcher: Dispatcher) : void

}
