import { Dispatcher } from './Dispatcher'

export interface RegistersNativeEvents {
  /**
   * Register all native events on the given module.
   *
   * @param {Dispatcher} dispatcher
   */
  registerEvents (dispatcher: Dispatcher) : void
}
