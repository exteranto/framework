import { TabIdUnknownException } from '@exteranto/exceptions'
import { Dispatcher, RegistersNativeEvents } from '@exteranto/core'
import { TabInterface } from '../TabInterface'
import { Tabs as AbstractTabs } from '../Tabs'
import { register } from './events'
import { Tab } from './Tab'

export class Tabs extends AbstractTabs implements RegistersNativeEvents {

  /**
   * @inheritdoc
   */
  protected filter (query: any = {}) : Promise<TabInterface[]> {
    return new Promise(resolve => chrome.tabs.query(query, (tabs) => {
      resolve(tabs.map(tab => new Tab(tab)))
    }))
  }

  /**
   * @inheritdoc
   */
  public open (url: string, active: boolean = false) : Promise<TabInterface> {
    return new Promise((resolve) => {
      chrome.tabs.create({ url, active }, tab => resolve(new Tab(tab)))
    })
  }

  /**
   * @inheritdoc
   */
  public async get (id: number) : Promise<TabInterface> {
    const { error, tab }: any = await new Promise((resolve) => {
      chrome.tabs.get(id, (data) => resolve({
        error: chrome.runtime.lastError,
        tab: data,
      }))
    })

    if (error) {
      throw new TabIdUnknownException()
    }

    return new Tab(tab)
  }

  /**
   * @inheritdoc
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    register(dispatcher)
  }
}
