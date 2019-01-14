
export interface Middleware {
  /**
   * Intercept the incoming request.
   *
   * @param {any} request
   */
  handle (request: any) : Promise<any>
}
