import { expect } from 'chai'
import { Handler } from '../../src/Handler'

describe('Handler Class', () => {

  it('should rethrow an error', () => {
    const handler = () => new Handler().handle(new TypeError)

    expect(handler).to.throw(TypeError)
  })

})
