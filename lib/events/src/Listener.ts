
export interface Listener {
  /**
   * Handle the fired event.
   *
   * @param {any} payload
   */
  handle (payload: any) : void
}
