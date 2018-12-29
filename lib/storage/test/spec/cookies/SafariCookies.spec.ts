import { expect } from 'chai'
import { Container } from '@exteranto/ioc'
import { Cookies } from '../../../src/Cookies'
import { Browser } from '@exteranto/support'

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
