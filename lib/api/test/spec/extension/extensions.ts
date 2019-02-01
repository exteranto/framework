import { expect } from 'chai'

import { Extension } from '@internal/extension'
import { Extension as ExtensionsExtension } from '@internal/extension/extensions/Extension'

export default ({ browser }) => {
  let extension: Extension

  beforeEach(() => {
    extension = new ExtensionsExtension
  })

  it('converts relative path to url', () => {
    browser.runtime.getURL.returns('browser://extension/abc/path')

    expect(extension.getUrl('path'))
      .to.equal('browser://extension/abc/path')
    expect(browser.runtime.getURL.calledOnce).to.be.true
  })
}
