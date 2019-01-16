import { Script } from './Script'

export abstract class Provider {
  /**
   * Class constructor.
   *
   * @param {any} container
   */
  constructor (
    protected container: any,
    protected router: any,
  ) {
    //
  }

  /**
   * The scripts that this provider should be registered for.
   *
   * @return {Script[]}
   */
  public only () : Script[] {
    return [Script.BACKGROUND, Script.CONTENT, Script.POPUP]
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
