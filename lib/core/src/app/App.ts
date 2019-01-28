import { Router } from './Router'
import { Autowired, Container } from '@internal/ioc'
import { Provider, Script, Utils } from '@internal/support'
import { AppBootedEvent, WindowLoadedEvent } from './events'
import { Dispatcher, Event, ListenerBag } from '@internal/events'

export class App {
  /**
   * The event dispatcher implementation.
   */
  @Autowired
  private dispatcher: Dispatcher

  /**
   * The provider instances.
   */
  private providers: Provider[]

  /**
   * @param script The script the application is being booted in
   * @param config The configuration object
   * @param registerEvents Callback containing all user defined events from the event router
   */
  constructor (
    private script: Script,
    private config: any,
    private registerEvents: (touch: (e: new (..._: any[]) => Event) => ListenerBag) => void,
  ) {
    //
  }

  /**
   * Starts the application by registering base params and bindins and booting
   * providers.
   */
  public start () : void {
    this.registerBaseParams()
    this.registerParamBindings()
    this.registerWindowLoadEvent()
    this.findProviders()
    this.bootProviders()
  }

  /**
   * Boots the application by registering providers, registering events from the
   * event router and firing the application booted event.
   */
  public boot () : void {
    this.registerProviders()
    this.registerEvents(e => this.dispatcher.touch(e))
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
   * Register the arbitrary window load event.
   */
  private registerWindowLoadEvent () : void {
    window.addEventListener('load', () => {
      this.dispatcher.mail(new WindowLoadedEvent())
    })
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
   * Fires the application booted event.
   */
  private fireBootedEvent () : void {
    this.dispatcher.fire(new AppBootedEvent())
  }
}
