import { tests as ExtensionTests } from './ExtensionsBrowserAction.spec'
import { tests as SafariTests } from './SafariBrowserAction.spec'
import { tests as ChromeTests } from './ChromeBrowserAction.spec'

describe('Browser Action', () => {
  ChromeTests()
  ExtensionTests()
  SafariTests()
})
