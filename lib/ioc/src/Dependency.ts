import { Browser } from '@exteranto/support'

export class Dependency {
  /**
   * The abstract version of the dependency.
   *
   * @var {any}
   */
  private abstract: any

  /**
   * The browser this dependency is assigned for.
   *
   * @var {Browser}
   */
  private browser: Browser

  /**
   * The instance of the dependency, if any.
   *
   * @var {any}
   */
  private instance: any

  /**
   * If the dependency is a singleton.
   *
   * @var {boolean}
   */
  private isSingleton: boolean = false

  /**
   * Class constructor.
   *
   * @param {any} concrete
   */
  constructor (private concrete: any) {
    //
  }

  /**
   * Define the abstract version of the dependency.
   *
   * @param {any} abstract
   * @return {Dependency}
   */
  public to (abstract: any) : Dependency {
    this.abstract = abstract

    return this
  }

  /**
   * Bind the concrete dependency to self.
   *
   * @return {Dependency}
   */
  public toSelf () : Dependency {
    return this.to(this.concrete)
  }

  /**
   * Specify the browser this dependency should be bound for.
   *
   * @param {Browser} browser
   * @return {Dependency}
   */
  public for (browser: Browser) : Dependency {
    this.browser = browser

    return this
  }

  /**
   * Specify if the dependency should be a singleton.
   *
   * @param {boolean} isSingleton
   * @return {Dependency}
   */
  public singleton (isSingleton: boolean) : Dependency {
    this.isSingleton = isSingleton

    return this
  }

  /**
   * Check if the dependency is suitable for the provided abstract on browser.
   *
   * @param {any} abstract
   * @param {Browser} browser
   * @return {boolean}
   */
  public isSuitableFor (abstract: any, browser: Browser) : boolean {
    return (this.abstract === abstract) && (this.browser === undefined || this.browser === browser)
  }

  /**
   * Resolve the dependency.
   *
   * @param {any[]} args
   * @return {any}
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
