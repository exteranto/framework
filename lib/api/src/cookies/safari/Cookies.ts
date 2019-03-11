import { Cookies as AbstractCookies } from '../Cookies'
import { RegistersNativeEvents } from '@exteranto/core'
import { NotImplementedException } from '@internal/exceptions'

export class Cookies extends AbstractCookies implements RegistersNativeEvents {

  /**
   * {@inheritdoc}
   */
  public async get () : Promise<any> {
    throw new NotImplementedException()
  }

  /**
   * {@inheritdoc}
   */
  public async getAll () : Promise<any[]> {
    throw new NotImplementedException()
  }

  /**
   * {@inheritdoc}
   */
  public async set () : Promise<void> {
    throw new NotImplementedException()
  }

  /**
   * {@inheritdoc}
   */
  public registerEvents () : void {
    //
  }

}
