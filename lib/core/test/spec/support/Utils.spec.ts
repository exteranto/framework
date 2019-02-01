import { expect } from 'chai'
import { Utils, Browser } from '../../../src/support'

describe('Utility Class', () => {
  it('determines chrome', () => {
    (global as any).window = { chrome: {} }

    expect(Utils.currentBrowser()).to.equal(Browser.CHROME)
  })

  it('determines extensions', () => {
    (global as any).window = { }

    expect(Utils.currentBrowser()).to.equal(Browser.EXTENSIONS)
  })

  it('determines safari', () => {
    (global as any).window = { safari: {} }

    expect(Utils.currentBrowser()).to.equal(Browser.SAFARI)
  })
})
