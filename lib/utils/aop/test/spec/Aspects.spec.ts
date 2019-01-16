import { expect } from 'chai'
import { AspectContainer } from '../../src/AspectContainer'

describe('Aspect Container', () => {

  it('registers and fires the before aspect', (done) => {
    const aspect = {
      before: p => expect(p[0]).to.equal('test-before') && done()
    }

    AspectContainer.bind('test-pointcut', 'before', aspect, 'before')
    AspectContainer.before('test-pointcut', ['test-before'])
  })

  it('registers and fires the after aspect', (done) => {
    const aspect = {
      after: p => expect(p[0]).to.equal('test-after') && done()
    }

    AspectContainer.bind('test-pointcut', 'after', aspect, 'after')
    AspectContainer.after('test-pointcut', ['test-after'])
  })

})
