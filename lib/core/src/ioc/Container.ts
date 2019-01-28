import { Browser } from '@internal/support'
import { Dependency } from './Dependency'

export class Container {

  /**
   * The container bindings.
   */
  private static bindings: Dependency[] = []

  /**
   * The container params.
   */
  private static params: any = {}

  /**
   * Binds a dependency to the application container.
   *
   * @param concrete The concrete type constructor to be bound
   * @return The dependency class instance for further configuration
   */
  public static bind (concrete: any) : Dependency {
    const dependency: Dependency = new Dependency(concrete)

    this.bindings.push(dependency)

    return dependency
  }

  /**
   * Binds a param to the application container.
   *
   * @param name The parameter name
   * @param param The parameter value to be bound
   */
  public static bindParam (name: string, param: any) : void {
    this.params[name] = param
  }

  /**
   * Resolves a dependency from the container.
   *
   * @param abstract The abstract type to be resolved
   * @param args Arguments that are provided to the type constructor
   * @return The resolved dependency instance
   */
  public static resolve (abstract: any, args: any[] = []) : any {
    const browser: Browser = this.resolveParam('browser')

    for (const dependency of this.bindings) {
      if (dependency.isSuitableFor(abstract, browser)) {
        return dependency.resolve(this.parseArgs(args))
      }
    }

    return null
  }

  /**
   * Resolves a param from the container.
   *
   * @param name The parameter name
   * @return The value of the parameter or null
   */
  public static resolveParam (name: string) : any {
    const path: string[] = name.split('.')

    return path.reduce((carry, fragment) => {
      if (carry === null) {
        return null
      }

      return carry[fragment] === undefined ? null : carry[fragment]
    }, this.params)
  }

  /**
   * Parses the argument array, replacing wildcards with dependencies from the
   * container.
   *
   * @param args Arguments to be parsed
   * @return Parsed arguments
   */
  private static parseArgs (args: any[]) : any {
    return args.map((arg) => {
      const matches: any[] = arg.match(/%([\w.-]+)%/)

      return matches === null ? arg : this.resolveParam(matches[1])
    })
  }

  /**
   * Dumps all the contents of the application container.
   */
  public static dump () : void {
    console.log(this.bindings, this.params)
  }

  /**
   * Reset the container. WARNING: This will remove all the dependencies from
   * the container.
   */
  public static reset () : void {
    this.bindings = []
    this.params = {}
  }

}
