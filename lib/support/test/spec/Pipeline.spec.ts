import { expect } from 'chai'
import { Pipeline } from '../../src/Pipeline'

describe('Pipeline Service', () => {

  it('modifies a value in the pipes', async () => {
    await expect(new Pipeline()
      .send('test')
      .through([
        passable => passable + '1',
        passable => passable + '2',
        passable => passable + '3'
      ])).to.eventually.equal('test123')
  })

  it('can use a method on an object as a pipe', async () => {
    await expect(new Pipeline()
      .send('test')
      .via('handle')
      .through([
        { handle: passable => passable + '1' },
        { handle: passable => passable + '2' },
        { handle: passable => passable + '3' }
      ])).to.eventually.equal('test123')
  })

  it('properly handles errors in pipes', async () => {
    await expect(new Pipeline()
      .send(Promise.resolve('test'))
      .through([
        passable => passable + '1',
        passable => { throw new Error() },
        passable => passable + '3'
      ])).to.eventually.be.rejected
  })

  it('works with promises', async () => {
    await expect(new Pipeline()
      .send(Promise.resolve('test'))
      .through([
        passable => Promise.resolve(passable + 1),
        passable => Promise.resolve(passable + 2),
        passable => Promise.resolve(passable + 3)
      ])).to.eventually.equal('test123')
  })

  it('properly handles errors in promises', async () => {
    await expect(new Pipeline()
      .send(Promise.resolve('test'))
      .through([
        passable => Promise.resolve(passable + 1),
        passable => Promise.reject(passable)
      ])).to.eventually.be.rejectedWith('test1')
  })
})
