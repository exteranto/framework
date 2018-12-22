import { Dispatcher } from '@exteranto/events'
import { Autowired, Container } from '@exteranto/ioc'
import { Provider, Script, Utils } from '@exteranto/support'

export class App {
  /**
   * The event dispatcher implementation.
   *
   * @var {Dispatcher} dispatcher
   */
  @Autowired
  private dispatcher: Dispatcher

  /**
   * The provider instances.
   *
   * @var {Provider[]} providers
   */
  private providers: Provider[]

  /**
   * Class constructor.
   *
   * @param {Script} script
   * @param {any} config
   * @param {any} events
   */
  constructor (
    private script: Script,
    private config: any,
    private events: any,
  ) {
    //
  }

  /**
   * Bootstraps the whole application.
   */
  public bootstrap () : void {
    this.registerBaseParams()
    this.registerParamBindings()

    // Find, boot and register providers.
    this.findProviders()
    this.bootProviders()
    this.registerProviders()

    this.registerEvents()
    this.fireBootedEvent()
  }

  /**
   * Registers crucial params in the container.
   */
  private registerBaseParams () : void {
    Container.bindParam('script', this.script)
    Container.bindParam('browser', Utils.currentBrowser())
  }

  /**
   * Find and instantiate specified service providers.
   */
  private findProviders () : void {
    this.providers = this.config.providers
      .map(Constructor => new Constructor(Container))
      .filter(provider => provider.only().filter(script => script === this.script).length === 1)
  }

  /**
   * Boot specified service providers.
   */
  private bootProviders () : void {
    this.providers.forEach(provider => provider.boot())
  }

  /**
   * Register specified service providers.
   */
  private registerProviders () : void {
    this.providers.forEach(provider => provider.register())
  }

  /**
   * Register specified parameter bindings.
   */
  private registerParamBindings () : void {
    for (const key in this.config.bound || []) {
      Container.bindParam(key, this.config.bound[key])
    }
  }

  /**
   * Registers all specified events.
   */
  private registerEvents () : void {
    for (const event in this.events) {
      // If we got only one listener instead of an array, make the listener an
      // array with one element.
      if (! (this.events[event] instanceof Array)) {
        this.events[event] = [this.events[event]]
      }

      for (const Listener of this.events[event]) {
        this.dispatcher.touch(event).addListener(new Listener)
      }
    }
  }

  /**
   * Fires the application booted event.
   */
  private fireBootedEvent () : void {
    this.dispatcher.fire('app.booted')
  }
}
