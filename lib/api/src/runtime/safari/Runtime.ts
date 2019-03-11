import { register } from './events'
import { Dispatcher } from '@exteranto/core'
import { Runtime as AbstractRuntime } from '../Runtime'
import { NotImplementedException } from '@internal/exceptions'

export class Runtime extends AbstractRuntime {

  /**
   * {@inheritdoc}
   */
  public async setUninstallUrl (_: string) : Promise<void> {
    throw new NotImplementedException()
  }

  /**
   * {@inheritdoc}
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    register(dispatcher)
  }

}
