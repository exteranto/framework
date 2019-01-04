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
import { Script } from '@exteranto/support'
import { StorageProvider } from '../src/StorageProvider'
import { CookiesProvider } from '../src/CookiesProvider'

chai.use(chaiAsPromised)

;(global as any).window = {}
;(global as any).chrome = chrome
;(global as any).browser = browser
;(global as any).localStorage = localStorage

const app: App = new App(Script.BACKGROUND, {
  providers: [
    StorageProvider,
    CookiesProvider
  ],
}, {})

app.start()
app.boot()

;(global as any).app = app

beforeEach(() => {
  chrome.flush()
  browser.flush()
  localStorage.clear()
})
