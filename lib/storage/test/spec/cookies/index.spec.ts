import { tests as chromeTests } from './ChromeCookies.spec'
import { tests as extensionsTests } from './ExtensionsCookies.spec'
import { tests as safariTests } from './SafariCookies.spec'

describe('Cookies API', () => {
  chromeTests()
  extensionsTests()
  safariTests()
})
