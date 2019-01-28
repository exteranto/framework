import { Sortable } from './Sortable'
import { Optional, None, Some } from '@internal/structures'

export class PriorityQueue<T extends Sortable> {

  /**
   * Queue elements.
   */
  protected els: T[] = []

  /**
   * @param maxSize Maximum queue length
   */
  constructor (private maxSize: number) {
    //
  }

  /**
   * Retrives element from queue.
   *
   * @return The head of the queue is returned and removed
   */
  public pop () : Optional<T> {
    const el: T = this.els.pop()

    return el === undefined ? new None() : new Some(el)
  }

  /**
   * Pushes new element into an array.
   *
   * @param el The element to be added to the queue
   */
  public push (el: T) : void {
    // Finds an element with highest priority that is lower than that of el.
    const index: number = this.els.findIndex(a => a.comp(el) < 0) + 1

    this.els.splice(index, 0, el)

    // Honours queue limit.
    if (this.els.length > this.maxSize) {
      this.els.shift()
    }
  }

  /**
   * Clears the queue.
   */
  public clear () : void {
    this.els = []
  }

  /**
   * Returns the number of elements in the queue.
   *
   * @return The current queue size
   */
  public size () : number {
    return this.els.length
  }

}
