/**
 * Holds Safari message promises that are resolved with payload when
 * the script receives a response from another script.
 */
export const ResponseHub: any = {

  /**
   * Key value store.
   */
  resolvables: {},

  /**
   * Creates a new promise.
   *
   * @return Object that has a promise and an identificator
   */
  createResolvable () : any {
    const id: string = this.getUniqueId()

    const resolvable: Promise<any> = new Promise((resolve, reject) => {
      this.resolvables[id] = response => response.ok ? resolve(response.body) : reject(response.body)
    })

    return { resolvable, id }
  },

  /**
   * Resolves a promise with payload.
   *
   * @param key Hash of promise to resolve
   * @param payload Payload to resolve the promise with
   */
  resolve (key: string, payload?: any) : void {
    if (this.resolvables[key] === undefined) {
      return
    }

    this.resolvables[key]({
      body: payload,
      ok: !(payload instanceof Error),
    })

    delete this.resolvables[key]
  },

  /**
   * Returns an id that has not been used yet.
   *
   * @return Unique string key
   */
  getUniqueId () : string {
    const id: string = Math.random().toString(16)

    return this.resolvables[id] === undefined ? id : this.getUniqueId()
  },
}
