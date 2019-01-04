import { tests as SafariTests } from './SafariRuntime.spec'
import { tests as ChromeTests } from './ChromeRuntime.spec'
import { tests as ExtensionsTests } from './ExtensionsRuntime.spec'

describe('Runtime', () => {
  SafariTests()

  ChromeTests()

  ExtensionsTests()
})
