import { extensionsTests } from './ExtensionsBrowserAction.spec'
import { safariTests } from './SafariBrowserAction.spec'
import { chromeTests } from './ChromeBrowserAction.spec'

describe('Browser Action', () => {
  chromeTests()
  extensionsTests()
  safariTests()
})
