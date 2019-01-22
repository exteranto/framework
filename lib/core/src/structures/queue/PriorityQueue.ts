import { Queue } from './Queue'
import { Sortable } from './Sortable'

export class PriorityQueue<T extends Sortable> extends Queue {
  /**
   * Queue elements.
   *
   * @var {T[]}
   */
  protected els: T[] = []

  /**
   * @inheritdoc
   */
  public pop () : T {
    return this.els.pop()
  }

  /**
   * Pushes new element into an array.
   *
   * @param {T} el
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
   * @inheritdoc
   */
  public clear () : void {
    this.els = []
  }

  /**
   * @inheritdoc
   */
  public size () : number {
    return this.els.length
  }
}
