import { register } from './events'
import { Dispatcher } from '@exteranto/events'
import { Runtime as AbstractRuntime } from '../Runtime'
import { NotImplementedException } from '@exteranto/exceptions'

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
  public registerEvents (dispatcher: Dispatcher) : void {
    register(dispatcher)
  }
}
