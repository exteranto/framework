import { Script } from './Script'
import { Container } from '@internal/ioc'

export abstract class Provider {

  /**
   * @param container The current container instance
   * // TODO: Consider dispatcher.
   */
  constructor (protected container: Container) {
    //
  }

  /**
   * The scripts that this provider should be registered for.
   *
   * @return The array of accepted scripts
   */
  public only () : Script[] {
    return [Script.BACKGROUND, Script.CONTENT]
  }

  /**
   * Boot the provider services.
   */
  public abstract boot () : void

  /**
   * Register the provider services.
   */
  public abstract register () : void
}
