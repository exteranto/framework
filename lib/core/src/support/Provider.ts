import { Script } from './Script'
import { Router } from '@internal/app'
import { Container } from '@internal/ioc'

export abstract class Provider {
  /**
   * @param container The current container instance
   * @param router The global router instance
   */
  constructor (
    protected container: typeof Container,
    protected router: typeof Router,
  ) {
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
