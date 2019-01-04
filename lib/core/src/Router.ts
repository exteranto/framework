import { Param } from '@exteranto/ioc'
import { Script } from '@exteranto/support'
import { InvalidRouteException } from '@exteranto/exceptions'

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
   * @var {any}
   */
  private static routes: any = {}

  /**
   * The edit actions to be performed.
   *
   * @var {any[]}
   */
  private static actions: any = []

  /**
   * Add routes to the global collection.
   *
   * @param {any[]} routes
   * @param {Script} script
   * @return {typeof Router}
   */
  public static add (routes: any[], script?: Script) : typeof Router {
    if (script !== undefined && script !== this.script) {
      return this
    }

    for (const route of routes) {
      if (!route.name) {
        throw new InvalidRouteException('Each route has to have a name.')
      }

      this.routes[route.name] = route
    }

    return this
  }

  /**
   * Stage editing of a route.
   *
   * @param {string} name
   * @param {(current: any) => any} action
   * @return {typeof Router}
   */
  public static edit (name: string, action: (current: any) => any) : typeof Router {
    this.actions.push({ name, action })

    return this
  }

  /**
   * Return all routes from the global collection.
   *
   * @return {any[]}
   */
  public static get () : any[] {
    // Perform all edit actions.
    this.actions.forEach(({ name, action }) => {
      if (this.routes[name]) {
        this.routes[name] = action(this.routes[name])
      }
    })

    return Object.keys(this.routes).map(key => this.routes[key])
  }
}
