import { expect } from 'chai'
import { Utils, Browser } from '../../../src/support'

describe('Utility Class', () => {

  it('determines the current browser', () => {
    expect(Utils.currentBrowser()).to.equal(Browser.TESTING)
  })

})
