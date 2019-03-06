import { Abstract, Class } from './types'
import { Browser } from '@internal/support'

export class Dependency<A, C extends A> {

  /**
   * Whether the dependency is a singleton.
   */
  private singleton: boolean

  /**
   * The abstract version of the dependency.
   */
  private abstract: Abstract<A>

  /**
   * The browser this dependency is assigned for.
   */
  private browser: Browser

  /**
   * The dependency tags.
   */
  private tags: { [key: string]: string } = {}

  /**
   * The instance of the dependency, if any.
   */
  private instance: C

  /**
   * @param concrete The binding constructor type
   */
  constructor (private concrete: Class<C>) {
    this.abstract = this.concrete
  }

  /**
   * Define the abstract version of the dependency.
   *
   * @param abstract The abstract constructor type
   * @return This class instance for chaining
   */
  public to (abstract: Abstract<A>) : Dependency<A, C> {
    this.abstract = abstract

    return this
  }

  /**
   * Bind the concrete dependency to self.
   *
   * @return This class instance for chaining
   */
  public toSelf () : Dependency<A, C> {
    return this.to(this.concrete)
  }

  /**
   * Specify the browser this dependency should be bound for. If none provided,
   * the dependency is bound for all browsers.
   *
   * @param browser The browser this dependency should only be bound for
   * @return This class instance for chaining
   */
  public for (browser: Browser) : Dependency<A, C> {
    this.browser = browser

    return this
  }

  /**
   * Specify if the dependency should be a singleton.
   *
   * @return This class instance for chaining
   */
  public asSingleton () : Dependency<A, C> {
    this.singleton = true

    return this
  }

  /**
   * Assign a tag to the dependency.
   *
   * @param name The tag name
   * @param value The tag value
   * @return This class instance for chaining
   */
  public tag (name: string, value: string) : Dependency<A, C> {
    this.tags[name] = value

    return this
  }

  /**
   * Check if the dependency is suitable for the provided abstract on browser.
   *
   * @param abstract The abstract type constructor to check for
   * @param browser The browser to check for
   * @param tags The required tags
   * @return Whether the dependency is suitable to be resolved for the provided abstract type
   */
  public isSuitableFor (abstract: Abstract<A>, browser: Browser, tags: { [key: string]: string }) : boolean {
    if (Object.keys(tags).filter(key => tags[key] !== this.tags[key]).length > 0) {
      return false
    }

    return (this.abstract === abstract) && (this.browser === undefined || this.browser === browser)
  }

  /**
   * Resolve the dependency. Store the instance if the dependency is
   * a singleton.
   *
   * @param args The constructor arguments
   * @return The dependency instance
   */
  public resolve (args: any[]) : C {
    // If this dependency is a singleton and we do have a saved instance, return
    // the instance.
    if (this.singleton && this.instance !== undefined) {
      return this.instance
    }

    // Otherwise, we instantiate the dependency and save it to the instance
    // variable.
    return this.instance = new this.concrete(...args)
  }

}
