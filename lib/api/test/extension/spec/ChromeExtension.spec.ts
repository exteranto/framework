import { expect } from 'chai'
import * as chrome from 'sinon-chrome'
import { Extension } from '../../../src'
import { Browser, Container } from '@exteranto/core'

export const tests = () => {
  describe('Chrome', () => {
    let extension: Extension

    before(() => {
      Container.bindParam('browser', Browser.CHROME)

      extension = Container.resolve(Extension)
    })

    it('converts relative path to url', () => {
      chrome.runtime.getURL.returns('chrome://extension/abc/path')

      expect(extension.getUrl('path'))
        .to.equal('chrome://extension/abc/path')
      expect(chrome.runtime.getURL.calledOnce).to.be.true
    })
  })
}
