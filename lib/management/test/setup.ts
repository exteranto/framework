/// <reference types="mocha" />
/// <reference types="chai" />
/// <reference types="chai-as-promised" />
/// <reference types="sinon" />
/// <reference types="sinon-chrome" />
/// <reference types="node" />

import * as chai from 'chai'
import * as chrome from 'sinon-chrome'
import { safari } from './safari'
import * as browser from 'sinon-chrome/extensions'
import * as chaiAsPromised from 'chai-as-promised'

import { App } from '@exteranto/core'
import { Script } from '@exteranto/support'

import { ManagementProvider } from '../src'

chai.use(chaiAsPromised)

;(global as any).window = {}
;(global as any).chrome = chrome
;(global as any).browser = browser
;(global as any).safari = safari

const app: App = new App(Script.BACKGROUND, {
  providers: [ManagementProvider]
}, {})

app.start()
app.boot()

beforeEach(() => {
  chrome.flush()
  browser.flush()
})
