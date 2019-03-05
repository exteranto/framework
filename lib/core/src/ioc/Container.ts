import { Abstract, Class } from './types'
import { Dependency } from './Dependency'
import { Browser } from '@internal/support'
import { Optional, Some, None } from '@bausano/data-structures'

import {
  ParameterNotFoundException,
  DependencyNotFoundException,
  MoreDependenciesMatchedException,
} from './exceptions'

export class Container {

  /**
   * The current container instance.
   */
  private static instance: Container

  /**
   * The bound container dependencies.
   */
  private dependencies: Array<Dependency<any, any>> = []

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
   * @param tags The tags to resolve by.
   * @return The resolved dependency instance
   * @throws {DependencyNotFoundException} If the dependency does not exist in
   * the container
   */
  public resolve<A> (
    abstract: Abstract<A>,
    args: any[] = [],
    tags: { [key: string]: string } = {},
  ) : A {
    const browser: Browser = this.resolveParam('browser')

    // Parse tags if they contain references to container params.
    Object.keys(tags)
      .forEach(key => tags[key] = this.parseArgument(tags[key]))

    // Parse arguments if they contain references to container params.
    args = args.map(arg => this.parseArgument(arg))

    // Find matching dependencies.
    const matches: Array<Dependency<A, any>> = this.dependencies
      .filter(dep => dep.isSuitableFor(abstract, browser, tags))

    if (matches.length === 0) {
      throw new DependencyNotFoundException(String(abstract))
    }

    if (matches.length > 1) {
      throw new MoreDependenciesMatchedException(String(abstract))
    }

    return matches.pop().resolve(args)
  }

  /**
   * Resolves a param from the container.
   *
   * @param name The parameter name
   * @return The value of the parameter
   * @throws {ParameterNotFoundException} If the parameter was not found in the
   * container
   */
  public resolveParam<T> (name: string) : T {
    return name.split('.').reduce((carry, fragment) => {
      if (carry[fragment] === undefined) {
        throw new ParameterNotFoundException(name)
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

  /**
   * Parses the argument array, replacing wildcards with dependencies from the
   * container.
   *
   * @param arg The argument to be parsed
   * @return The parsed argument
   * @throws {ParameterNotFoundException} If the parameter was not found in the
   * container
   */
  private parseArgument (arg: any) : any {
    if (typeof arg !== 'string') {
      return arg
    }

    const matches: any[] = arg.match(/%([\w.-]+)%/)

    return matches === null ? arg : this.resolveParam(matches[1])
  }

}
