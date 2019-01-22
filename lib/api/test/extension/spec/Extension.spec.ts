import { tests as ChromeTests } from './ChromeExtension.spec'
import { tests as SafariTests } from './SafariExtension.spec'
import { tests as ExtensionsTests } from './ExtensionsExtension.spec'

describe('Extension', () => {
  SafariTests()

  ChromeTests()

  ExtensionsTests()
})
