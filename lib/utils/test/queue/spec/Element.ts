import { Sortable } from '../../../src/queue'

export class Element implements Sortable {
  constructor (public priority, public value) {
    //
  }

  public comp (a: Element) : number {
    return a.priority < this.priority ? 1 : a.priority === this.priority ? 0 : -1
  }
}
