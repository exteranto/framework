import { expect } from 'chai'

import { safari } from '../safari'
import { localStorage } from '../localStorage'

describe('Mocks', () => {

  /**
   * Local storage mock that is assigned to global object
   * in each test suite that uses it. It behaves just like
   * localStorage in browser, but is destoryed when the
   * test suite finishes.
   */

  it('Localstorage has all properties', () => {
    expect(localStorage).to.be.an('object')
  })

  /**
   * Temporary Safari mock that is assigned to global object in each
   * safari test suite that uses it. It does not have all
   * properties that safari object in the browser does, nor
   * is has any functionality. We use stubs within each test suite to
   * create tests for our safari packages.
   */

  it('Safari has all properties', () => {
    expect(safari).to.be.an('object')
  })
})
