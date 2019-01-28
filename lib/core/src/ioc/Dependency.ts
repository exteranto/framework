import { Browser } from '@internal/support'

export class Dependency {
  /**
   * The abstract version of the dependency.
   */
  private abstract: any

  /**
   * The browser this dependency is assigned for.
   */
  private browser: Browser

  /**
   * The instance of the dependency, if any.
   */
  private instance: any

  /**
   * If the dependency is a singleton.
   */
  private isSingleton: boolean = false

  /**
   * @param concrete The binding constructor type
   */
  constructor (private concrete: any) {
    //
  }

  /**
   * Define the abstract version of the dependency.
   *
   * @param abstract The abstract constructor type
   * @return This class instance for chaining
   */
  public to (abstract: any) : Dependency {
    this.abstract = abstract

    return this
  }

  /**
   * Bind the concrete dependency to self.
   *
   * @return This class instance for chaining
   */
  public toSelf () : Dependency {
    return this.to(this.concrete)
  }

  /**
   * Specify the browser this dependency should be bound for. If none provided,
   * the dependency is bound for all browsers.
   *
   * @param browser The browser this dependency should only be bound for
   * @return This class instance for chaining
   */
  public for (browser: Browser) : Dependency {
    this.browser = browser

    return this
  }

  /**
   * Specify if the dependency should be a singleton.
   *
   * @param isSingleton Whether the dependency should be a singleton
   * @return This class instance for chaining
   */
  public singleton (isSingleton: boolean) : Dependency {
    this.isSingleton = isSingleton

    return this
  }

  /**
   * Check if the dependency is suitable for the provided abstract on browser.
   *
   * @param abstract The abstract type constructor to check for
   * @param browser The browser to check for
   * @return Whether the dependency is suitable to be resolved for the provided abstract type
   */
  public isSuitableFor (abstract: any, browser: Browser) : boolean {
    return (this.abstract === abstract) && (this.browser === undefined || this.browser === browser)
  }

  /**
   * Resolve the dependency. Store the instance if the dependency is
   * a singleton.
   *
   * @param args The constructor arguments
   * @return The dependency instance
   */
  public resolve (args: any[]) : any {
    // If this dependency is a singleton and we do have a saved instance, return
    // the instance.
    if (this.isSingleton && this.instance !== undefined) {
      return this.instance
    }

    // Otherwise, we instantiate the dependency and save it to the instance
    // variable.
    return this.instance = new this.concrete(...args)
  }
}
