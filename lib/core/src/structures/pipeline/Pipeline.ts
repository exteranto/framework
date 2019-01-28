
export class Pipeline {

  /**
   * The object passed through the pipe.
   */
  private passable: any

  /**
   * The method name to be used on the pipes.
   */
  private method: string

  /**
   * Assignt data to be sent throught the pipeline.
   *
   * @param passable The data to be sent via the pipeline
   * @return This pipeline instance for chaining
   */
  public send (passable: any) : Pipeline {
    this.passable = passable

    return this
  }

  /**
   * If specified, this method on the pipe object is going to be used.
   *
   * @param method The method name to be used
   * @return This pipeline instance for chaining
   */
  public via (method: string) : Pipeline {
    this.method = method

    return this
  }

  /**
   * The array of pipes to be invoked.
   *
   * @param pipes The pipes to pass the data through
   * @return A promise resolved with the transformed object
   */
  public through (pipes: any[]) : Promise<any> {
    return pipes.reduce((carry, pipe) => {
      return carry.then(this.callPipe(pipe))
    }, Promise.resolve(this.passable))
  }

  /**
   * Executes pipe.
   *
   * @param pipe The pipe to be executed
   * @return The chained callback
   */
  private callPipe (pipe: any) : (res: any) => Promise<any> {
    return async (res) => {
      return this.method === undefined
        ? await pipe(res)
        : await pipe[this.method](res)
    }
  }

}
