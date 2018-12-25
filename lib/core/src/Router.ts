import { Param } from '@exteranto/ioc'
import { Script } from '@exteranto/support'

export class Router {
  /**
   * The current script.
   *
   * @var {string}
   */
  @Param('script')
  private static script: Script

  /**
   * The routes to be added.
   *
   * @var {any[]}
   */
  private static routes: any = []

  /**
   * Add routes to the global collection.
   *
   * @param {any[]} routes
   * @param {Script} script
   */
  public static add (routes: any[], script?: Script) : typeof Router {
    if (script === undefined || script === this.script) {
      this.routes = this.routes.concat(routes)
    }

    return this
  }

  /**
   * Return all routes from the global collection.
   *
   * @return {any[]}
   */
  public static get () : any[] {
    return this.routes
  }
}
