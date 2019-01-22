/// <reference types="mocha" />
/// <reference types="chai" />
/// <reference types="sinon" />
/// <reference types="sinon-chrome" />
/// <reference types="node" />

import * as chrome from 'sinon-chrome'
import { safari } from '../../test/mocks/safari'
import * as browser from 'sinon-chrome/extensions'
import { App, Script } from '@exteranto/core'
import { ExtensionProvider } from '../../src'

;(global as any).chrome = chrome
;(global as any).browser = browser
;(global as any).safari = safari

;(global as any).window = {
  addEventListener: (_, l) => l()
}

const app: App = new App(Script.BACKGROUND, {
  providers: [ExtensionProvider]
}, () => {})


app.start()
app.boot()

beforeEach(() => {
  chrome.flush()
  browser.flush()
})
