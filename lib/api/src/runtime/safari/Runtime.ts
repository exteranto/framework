import { register } from './events'
import { Dispatcher } from '@exteranto/core'
import { Runtime as AbstractRuntime } from '../Runtime'
import { NotImplementedException } from '@exteranto/exceptions'

declare var safari: any

export class Runtime extends AbstractRuntime {
  /**
   * @inheritdoc
   */
  public async setUninstallUrl (_: string) : Promise<void> {
    throw new NotImplementedException()
  }

  /**
   * @inheritdoc
   */
  public extensionUrl (path: string = '') : string {
    return `${safari.extension.baseURI}${path}`
  }

  /**
   * @inheritdoc
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    register(dispatcher)
  }
}
