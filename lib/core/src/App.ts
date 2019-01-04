import { Dispatcher } from '@exteranto/events'
import { Autowired, Container } from '@exteranto/ioc'
import { Provider, Script, Utils } from '@exteranto/support'
import { Router } from './Router'

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
  }

  /**
   * Starts the whole application.
   */
  public start () : void {
    this.registerBaseParams()
    this.registerParamBindings()
    this.findProviders()
    this.bootProviders()
  }

  /**
   * Boots the whole application.
   */
  public boot () : void {
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
   * Register specified parameter bindings.
   */
  private registerParamBindings () : void {
    for (const key in this.config.bound || []) {
      Container.bindParam(key, this.config.bound[key])
    }
  }

  /**
   * Find and instantiate specified service providers.
   */
  private findProviders () : void {
    this.providers = this.config.providers
      .map(Constructor => new Constructor(Container, Router))
      .filter(provider => provider.only().indexOf(this.script) !== -1)
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
        this.dispatcher.touch(event).addListener(new Listener())
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
