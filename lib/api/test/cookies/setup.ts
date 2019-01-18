/// <reference types="mocha" />
/// <reference types="chai" />
/// <reference types="chai-as-promised" />
/// <reference types="sinon" />
/// <reference types="sinon-chrome" />
/// <reference types="node" />

import * as chai from 'chai'
import * as chrome from 'sinon-chrome'
import * as chaiAsPromised from 'chai-as-promised'
import * as browser from 'sinon-chrome/extensions'
import { localStorage } from '../../test/mocks/localStorage'

import { App } from '@exteranto/core'
import { Script } from '@exteranto/core'
import { CookiesProvider } from '../../src'

chai.use(chaiAsPromised)

;(global as any).chrome = chrome
;(global as any).browser = browser
;(global as any).localStorage = localStorage

;(global as any).window = {
  addEventListener: (_, l) => l()
}

const app: App = new App(Script.BACKGROUND, {
  providers: [CookiesProvider],
}, () => {})

app.start()
app.boot()

;(global as any).app = app

beforeEach(() => {
  chrome.flush()
  browser.flush()
  localStorage.clear()
})
