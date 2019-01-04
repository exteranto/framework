
export class ResponseHub {

  /**
   * Key value store.
   *
   * @param {any}
   */
  private resolvables: any = {}

  /**
   * Creates a new promise.
   *
   * @param {string} key
   * @return {any}
   */
  public createResolvable () : any {
    const id: string = this.getUniqueId()

    const resolvable: Promise<any> = new Promise(resolve => this.resolvables[id] = resolve)

    return { resolvable, id }
  }

  /**
   * Resolves a promise with payload.
   *
   * @param {string} key
   * @param {any} payload
   * @return {void}
   */
  public resolve (key: string, payload?: any) : void {
    if (this.resolvables[key] === undefined) {
      return
    }

    this.resolvables[key].resolve(payload)

    delete this.resolvables[key]
  }

  /**
   * Returns an id that has not been used yet.
   *
   * @return {string}
   */
  private getUniqueId () : string {
    const id: string = Math.random().toString(16)

    return this.resolvables[id] === undefined ? id : this.getUniqueId()
  }
}
