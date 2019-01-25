import { expect } from 'chai'

import { Extension } from '@internal/extension'
import { Extension as ChromeExtension } from '@internal/extension/chrome/Extension'

export default ({ chrome }) => {
  let extension: Extension

  beforeEach(() => {
    extension = new ChromeExtension
  })

  it('converts relative path to url', () => {
    chrome.runtime.getURL.returns('chrome://extension/abc/path')

    expect(extension.getUrl('path'))
      .to.equal('chrome://extension/abc/path')
    expect(chrome.runtime.getURL.calledOnce).to.be.true
  })
}
