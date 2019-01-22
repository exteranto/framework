import { expect } from 'chai'
import { Container, Browser } from '@exteranto/core'
import { Extension } from '../../../src'

declare var global: any

export const tests = () => {
  describe('Safari', () => {
    let extension: Extension

    before(() => {
      Container.bindParam('browser', Browser.SAFARI)

      extension = Container.resolve(Extension)
    })

    it('converts relative path to url', () => {
      expect(extension.getUrl('path'))
        .to.equal('safari-extension://abc/path')
    })
  })
}
