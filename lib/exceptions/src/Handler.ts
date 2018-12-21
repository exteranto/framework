import { Listener } from '@exteranto/events'

export class Handler implements Listener {
  /**
   * Handle the thrown exception. Note that the default implementation just
   * rethrows the error. Please create your own handler implementations and make
   * them extend this class.
   *
   * @param {Error} payload
   */
  public handle (payload: Error) : void {
    throw payload
  }
}
