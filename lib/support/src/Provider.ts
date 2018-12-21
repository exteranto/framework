import { Script } from './Script'

export abstract class Provider {
  /**
   * The scripts that this provider should be registered for.
   *
   * @return {Script[]}
   */
  public only () : Script[] {
    return [Script.BACKGROUND, Script.CONTENT, Script.POPUP]
  }

  /**
   * Register the provider services.
   *
   * @param {any} container
   */
  public abstract register (container: any) : void
}
