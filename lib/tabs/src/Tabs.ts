import { TabInterface } from './TabInterface'
import { Dispatcher, RegistersNativeEvents } from '@exteranto/events'

export abstract class Tabs implements RegistersNativeEvents {

  /**
   * Returns the active tab object.
   *
   * @return {Promise<Tab>}
   */
  public active () : Promise<TabInterface> {
    return this.query({ active: true, currentWindow: true })
      .then(tabs => tabs.pop())
  }

  /**
   * Returns all the tabs that are open at the moment.
   *
   * @return {Promise<TabInterface[]>}
   */
  public all () : Promise<TabInterface[]> {
    return this.query({})
  }

  /**
   * Returns all the tabs that are open at the moment in the current window.
   *
   * @return {Promise<TabInterface[]>}
   */
  public allInCurrentWindow () : Promise<TabInterface[]> {
    return this.query({ currentWindow: true })
  }

  /**
   * Returns all the tabs that are pinned.
   *
   * @return {Promise<TabInterface[]>}
   */
  public pinned () : Promise<TabInterface[]> {
    return this.query({ pinned: true })
  }

  /**
   * Returns all tabs that match the provided url.
   *
   * @param {RegExp|string} url
   * @return {Promise<TabInterface[]>}
   */
  public withUrl (url: RegExp|string) : Promise<TabInterface[]> {
    return this.query({ url })
  }

  /**
   * Returns all tabs that match the provided query
   * and filters url via regex rather than match pattern.
   *
   * @param {any} query
   * @return {Promise<TabInterface[]>}
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
   * Returns all tabs that match the provided query.
   *
   * @param {any} query
   * @return {Promise<TabInterface[]>}
   */
  protected abstract filter (query: any) : Promise<TabInterface[]>

  /**
   * Opens a brand new tab with specified parameters.
   *
   * @param {string} url
   * @param {boolean} active
   * @return {Promise<TabInterface>}
   */
  public abstract open (url: string, active?: boolean) : Promise<TabInterface>

  /**
   * @inheritdoc
   */
  public abstract registerEvents(dispatcher: Dispatcher): void
}
