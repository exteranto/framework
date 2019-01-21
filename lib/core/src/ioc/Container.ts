import { Browser } from '@internal/support'
import { Dependency } from './Dependency'

export class Container {
  /**
   * The container bindings.
   *
   * @var {object}
   */
  private static bindings: Dependency[] = []

  /**
   * The container params.
   *
   * @var {object}
   */
  private static params: any = {}

  /**
   * Binds a dependency to the application container.
   *
   * @param {any} concrete
   * @return {Dependency}
   */
  public static bind (concrete: any) : Dependency {
    const dependency: Dependency = new Dependency(concrete)

    this.bindings.push(dependency)

    return dependency
  }

  /**
   * Binds a param to the application container.
   *
   * @param {string} name
   * @param {any} param
   */
  public static bindParam (name: string, param: any) : void {
    this.params[name] = param
  }

  /**
   * Resolves a dependency from the container.
   *
   * @param {string} abstract
   * @param {any[]} args
   * @return {any}
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
   * @param {string} name
   * @return {any}
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
   * @param {any[]} args
   * @return {any}
   */
  private static parseArgs (args: any[]) : any {
    return args.map((arg) => {
      const matches: any[] = arg.match(/%([\w.-]+)%/)

      return matches === null ? arg : this.resolveParam(matches[1])
    })
  }

  /**
   * Dumps all the contents of the application container.
   *
   * @return {void}
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
