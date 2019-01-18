import { expect } from 'chai'
import { Container } from '@exteranto/core'
import { Cookies } from '../../../src'
import { Browser } from '@exteranto/core'

export const tests = () => {
  describe('Safari', () => {
    it('has Cookies service bound in IoC', async() => {
      Container.bindParam('browser', Browser.SAFARI)

      expect(Container.resolve(Cookies)).to.be.equal(null)
    })

    it('fires an exception if this service is used', async () => {
      //
    })
  })
}
