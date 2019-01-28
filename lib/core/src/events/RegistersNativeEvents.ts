import { Dispatcher } from './Dispatcher'

export interface RegistersNativeEvents {

  /**
   * Register all native events on the given module.
   *
   * @param dispatcher The event dispatcher implementation
   */
  registerEvents (dispatcher: Dispatcher) : void

}
