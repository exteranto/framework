import { register } from './events'
import { Dispatcher } from '@exteranto/events'
import { Runtime as AbstractRuntime } from '../Runtime'
import { NotImplementedException } from '@exteranto/exceptions'

declare var safari: any

export class Runtime extends AbstractRuntime {
  /**
   * @inheritdoc
   */
  public setUninstallUrl (_: string) : Promise<void> {
    throw new NotImplementedException(
      '@exteranto/management', 'Runtime', 'setUninstallUrl',
    )
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
