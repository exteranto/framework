import { Abstract, Class } from './types'
import { Dependency } from './Dependency'
import { Browser } from '@internal/support'
import { Optional, Some, None } from '@internal/structures'

export class Container {

  /**
   * The current container instance.
   */
  private static instance: Container

  /**
   * The bound container dependencies.
   */
  private dependencies: Dependency<any, any>[] = []

  /**
   * The bound container dependencies.
   */
  private params: { [key: string]: any } = {}

  /**
   * Get the current container instance.
   */
  public static getInstance () : Container {
    return this.instance === undefined
      ? this.instance = new Container()
      : this.instance
  }

  /**
   * RESET the container.
   */
  public static reset () : void {
    this.instance = undefined
  }

  /**
   * Binds a dependency to the application container.
   *
   * @param concrete The concrete type constructor to be bound
   * @return The dependency class instance for further configuration
   */
  public bind<C> (concrete: Class<C>) : Dependency<any, C> {
    const dependency: Dependency<any, C> = new Dependency(concrete)

    this.dependencies.push(dependency)

    return dependency
  }

  /**
   * Bind a parameter to the container.
   *
   * @param key The parameter key
   * @param value The parameter value
   */
  public bindParam (key: string, value: any) : void {
    this.params[key] = value
  }

  /**
   * Resolves a dependency from the container.
   *
   * @param abstract The abstract type to be resolved
   * @param args Arguments that are provided to the constructor
   * @return The resolved dependency instance
   * // TODO Throws
   */
  public resolve<A> (abstract: Abstract<A>, args: any[] = []) : A {
    const browser: Browser = this.resolveParam('browser')

    for (const dependency of this.dependencies) {
      if (dependency.isSuitableFor(abstract, browser)) {
        return dependency.resolve(args)
      }
    }

    // TODO: Throw.
    throw new Error('no dep.')
  }

  /**
   * Resolves a param from the container.
   *
   * @param name The parameter name
   * @return The value of the parameter or null
   * // TODO Throws
   */
  public resolveParam (name: string) : any {
    return name.split('.').reduce((carry, fragment) => {
      if (carry[fragment] === undefined) {
        // TODO Throw.
        throw new Error('no param')
      }

      return carry[fragment]
    }, this.params)
  }

  /**
   * Resolves a dependency from the container as an optional.
   *
   * @param abstract The abstract type to be resolved
   * @param args Arguments that are provided to the constructor
   * @return The resolved dependency instance, wrapped in an optional
   */
  public resolveOptional<A> (abstract: Abstract<A>, args: any[] = []) : Optional<A> {
    try {
      return new Some(this.resolve<A>(abstract, args))
    } catch {
      return new None()
    }
  }

}
