
export class Pipeline {
  /**
   * The object passed through the pipe.
   *
   * @var {any}
   */
  private passable: any

  /**
   * The method name to be used on the pipes.
   *
   * @var {string}
   */
  private method: string

  /**
   * The object to be sent through the pipeline.
   *
   * @param {any} passable
   * @return {Pipeline}
   */
  public send (passable: any) : Pipeline {
    this.passable = passable

    return this
  }

  /**
   * If specified, this method on the pipe object is going to be used.
   *
   * @param {string} method
   * @return {Pipeline}
   */
  public via (method: string) : Pipeline {
    this.method = method

    return this
  }

  /**
   * The array of pipes to be invoked.
   *
   * @param {any[]} pipes
   * @return {Promise<any>}
   */
  public through (pipes: any[]) : Promise<any> {
    return pipes.reduce((carry, pipe) => {
      return carry.then(this.callPipe(pipe))
    }, Promise.resolve(this.passable))
  }

  /**
   * Executes pipe.
   *
   * @param {any} pipe
   * @return {(res: any) => Promise<any>}
   */
  private callPipe (pipe: any) : (res: any) => Promise<any> {
    return async (res) => {
      return this.method === undefined
        ? await pipe(res)
        : await pipe[this.method](res)
    }
  }
}
