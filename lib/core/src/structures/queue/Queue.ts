
export abstract class Queue {
  /**
   * @constructor
   *
   * @param {number} maxSize Maximum queue length.
   */
  constructor (protected maxSize: number) {
    //
  }

  /**
   * Inserts element into queue.
   *
   * @param {any} el
   */
  public abstract push (el: any) : void

  /**
   * Retrives element from queue.
   *
   * @return {any}
   */
  public abstract pop () : any

  /**
   * Clears the queue.
   */
  public abstract clear () : void

  /**
   * Returns the length.
   *
   * @return {number}
   */
  public abstract size () : number
}
