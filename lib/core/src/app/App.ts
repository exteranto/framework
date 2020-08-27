import { Provider, Script, Utils } from '@internal/support'
import { AppBootedEvent, WindowLoadedEvent, WindowContentEvent } from './events'
import { Autowired, Container, Self, Class } from '@internal/ioc'
import { Dispatcher, Event, ListenerBag } from '@internal/events'

export class App {

  /**
   * The current container instance.
   */
  @Self
  private container: Container

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
    private registerEvents: (touch: (e: Class<Event>) => ListenerBag) => void,
  ) {
    //
  }

  /**
   * Boots the application by registering base params and bindins and booting
   * providers, registering providers, registering events from the event router
   * and firing the application booted event.
   */
  public bootstrap () : void {
    this.registerBaseParams()
    this.registerParamBindings()
    this.registerWindowEvents()
    this.findProviders()
    this.bootProviders()
    this.registerProviders()
    this.registerEvents(e => this.dispatcher.touch(e))
    this.fireBootedEvent()
  }

  /**
   * Registers crucial params in the container.
   */
  private registerBaseParams () : void {
    this.container.bindParam('script', this.script)
    this.container.bindParam('browser', Utils.currentBrowser())
  }

  /**
   * Register specified parameter bindings.
   */
  private registerParamBindings () : void {
    for (const key in this.config.bound || []) {
      this.container.bindParam(key, this.config.bound[key])
    }
  }

  /**
   * Register the arbitrary window content / load events.
   */
  private registerWindowEvents () : void {
    if (document.readyState === 'complete') {
      return this.dispatcher.mail(new WindowLoadedEvent())
    }

    window.addEventListener('load', () => {
      this.dispatcher.mail(new WindowLoadedEvent())
    }, { once: true })

    if (document.readyState === 'interactive') {
      return this.dispatcher.mail(new WindowContentEvent())
    }

    window.addEventListener('DOMContentLoaded', () => {
      this.dispatcher.mail(new WindowContentEvent())
    }, { once: true })
  }

  /**
   * Find and instantiate specified service providers.
   */
  private findProviders () : void {
    this.providers = this.config.providers
      .map((Constructor: Class<Provider>) => new Constructor(this.container))
      .filter((provider: Provider) => provider.only().indexOf(this.script) !== -1)
  }

  /**
   * Boot specified service providers.
   */
  private bootProviders () : void {
    this.providers.forEach((provider: Provider) => provider.boot())
  }

  /**
   * Register specified service providers.
   */
  private registerProviders () : void {
    this.providers.forEach((provider: Provider) => provider.register())
  }

  /**
   * Fires the application booted event.
   */
  private fireBootedEvent () : void {
    this.dispatcher.fire(new AppBootedEvent())
  }

}
