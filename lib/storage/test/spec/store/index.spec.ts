import { tests as chromeTests } from './ChromeStorage.spec'
import { tests as extensionsTests } from './ExtensionsStorage.spec'
import { tests as safariTests } from './SafariStorage.spec'

describe('Storage API', () => {
  chromeTests()
  extensionsTests()
  safariTests()
})
