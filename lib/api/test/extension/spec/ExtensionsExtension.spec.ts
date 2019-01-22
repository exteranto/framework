import { expect } from 'chai'
import * as browser from 'sinon-chrome/extensions'
import { Container, Browser } from '@exteranto/core'
import { Extension } from '../../../src'

declare var global: any

export const tests = () => {
  describe('Extensions', () => {
    let extension: Extension

    before(() => {
      Container.bindParam('browser', Browser.EXTENSIONS)

      extension = Container.resolve(Extension)
    })

    it('converts relative path to url', () => {
      browser.runtime.getURL.returns('extensions://extension/abc/path')

      expect(extension.getUrl('path'))
        .to.equal('extensions://extension/abc/path')
      expect(browser.runtime.getURL.calledOnce).to.be.true
    })
  })
}
