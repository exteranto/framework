import { Param } from '@internal/ioc'
import { Script } from '@internal/support'
import { InvalidRouteException } from '@exteranto/exceptions'

export class Router {

  /**
   * The current script.
   */
  @Param('script')
  private static script: Script

  /**
   * The routes to be added.
   */
  private static routes: any = {}

  /**
   * The edit actions to be performed.
   */
  private static actions: any = []

  /**
   * Add routes to the global collection.
   *
   * @param routes The routes to be added to the global collection
   * @return The router object for chaining
   * @throws {InvalidRouteException}
   */
  public static add (routes: any[]) : typeof Router {
    if (this.script !== Script.CONTENT) {
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
   * Stage editing of a route by providing a callback that returns a modified
   * route.
   *
   * @param name The name of the route to be edited
   * @param action The callback that modifies the route
   * @return The router object for chaining
   */
  public static edit (name: string, action: (current: any) => any) : typeof Router {
    this.actions.push({ name, action })

    return this
  }

  /**
   * Return all routes from the global collection.
   *
   * @return All the routes added to the global collection
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
