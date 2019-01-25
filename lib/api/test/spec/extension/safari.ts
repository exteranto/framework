import { expect } from 'chai'

import { Extension } from '@internal/extension'
import { Extension as SafariExtension } from '@internal/extension/safari/Extension'

export default () => {
  let extension: Extension

  beforeEach(() => {
    extension = new SafariExtension
  })

  it('converts relative path to url', () => {
    expect(extension.getUrl('path'))
      .to.equal('safari-extension://abc/path')
  })
}
