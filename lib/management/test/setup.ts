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

new App(Script.BACKGROUND, {
  providers: [ManagementProvider]
}, {}).bootstrap()

;(global as any).chrome = chrome
;(global as any).browser = browser
;(global as any).safari = safari

beforeEach(() => {
  chrome.flush()
  browser.flush()
})
