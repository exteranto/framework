import { expect } from 'chai'
import { Element } from './Element'
import { PriorityQueue } from '../../../src/queue'

describe('PriorityQueue', () => {

  it('pushes new element', () => {
    const queue = new PriorityQueue(5)

    queue.push(new Element(1, 'hey'))

    expect(queue.size()).to.equal(1)
  })

  it('pops an element', () => {
    const queue = new PriorityQueue(5)

    queue.push(new Element(1, 'hey'))

    expect(queue.pop()).to.have.property('value').that.equals('hey')
  })

  it('honours the priority', () => {
    const queue = new PriorityQueue(5)

    queue.push(new Element(1, 'hey'))

    queue.push(new Element(3, 'there'))

    queue.push(new Element(1, 'stranger'))

    expect(queue.pop()).to.have.property('value').that.equals('there')
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

    expect(queue.pop()).to.have.property('value').that.equals('hey')
  })
})

