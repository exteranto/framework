import { expect } from 'chai'

import { PriorityQueue, Sortable } from '@internal/structures'

describe('PriorityQueue', () => {
  it('pushes new element', () => {
    const queue = new PriorityQueue(5)

    queue.push(new Element(1, 'hey'))

    expect(queue.size()).to.equal(1)
  })

  it('pops an element', () => {
    const queue = new PriorityQueue(5)

    queue.push(new Element(1, 'hey'))

    expect(queue.pop().unwrap()).to.have.property('value').that.equals('hey')
  })

  it('honours the priority', () => {
    const queue = new PriorityQueue(5)

    queue.push(new Element(1, 'hey'))
    queue.push(new Element(3, 'there'))
    queue.push(new Element(1, 'stranger'))

    expect(queue.pop().unwrap()).to.have.property('value').that.equals('there')
  })

  it('honours the queue max size', () => {
    const queue = new PriorityQueue(1)

    queue.push(new Element(1, 'hey'))
    queue.push(new Element(3, 'there'))

    expect(queue.size()).to.be.equal(1)
  })

  it('clears the queue', () => {
    const queue = new PriorityQueue(1)

    queue.push(new Element(1, 'hey'))
    queue.clear()

    expect(queue.size()).to.be.equal(0)
  })

  it('works like FIFO for same priority', () => {
    const queue = new PriorityQueue(1)

    queue.push(new Element(1, 'hey'))
    queue.push(new Element(1, 'there'))

    expect(queue.pop().unwrap()).to.have.property('value').that.equals('hey')
  })
})

export class Element implements Sortable {
  constructor (public priority, public value) {
    //
  }

  public comp (a: Element) : number {
    return a.priority < this.priority ? 1 : a.priority === this.priority ? 0 : -1
  }
}
