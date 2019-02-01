import generate from '../../utils/generate'

import chrome from './chrome'
import extensions from './extensions'
import safari from './safari'

describe('Tabs', () => {
  generate({ chrome, extensions, safari })
})
