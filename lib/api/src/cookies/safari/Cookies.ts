import { Cookies as AbstractCookies } from '../Cookies'
import { RegistersNativeEvents } from '@exteranto/core'
import { NotImplementedException } from '@exteranto/exceptions'

export class Cookies extends AbstractCookies implements RegistersNativeEvents {

  /**
   * @inheritdoc
   */
  public async get (_url: string, _name: string) : Promise<any> {
    throw new NotImplementedException
  }

  /**
   * @inheritdoc
   */
  public async getAll (_?: any) : Promise<any[]> {
    throw new NotImplementedException
  }

  /**
   * @inheritdoc
   */
  public async set (_?: any) : Promise<void> {
    throw new NotImplementedException
  }

  /**
   * @inheritdoc
   */
  public registerEvents () : void {
    //
  }
}
