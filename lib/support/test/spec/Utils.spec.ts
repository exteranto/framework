import { expect } from 'chai'
import { Utils } from '../../src/Utils'
import { Browser } from '../../src/Browser'

describe('Utility Class', () => {

  it('determines the current browser', () => {
    expect(Utils.currentBrowser()).to.equal(Browser.TESTING)
  })

})
