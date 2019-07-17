import generate from '../../utils/generate'

import chrome from './chrome'
import extensions from './extensions'
import safari from './safari'

describe('BrowserAction', () => {
  generate({ chrome, extensions, safari })

  it('fires an event when a context menu item was clicked')
})
