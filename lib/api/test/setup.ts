/// <reference types="chai" />
/// <reference types="node" />
/// <reference types="mocha" />
/// <reference types="sinon" />
/// <reference types="sinon-chrome" />
/// <reference types="chai-as-promised" />

import * as chai from 'chai'
import * as chrome from 'sinon-chrome'
import { safari } from '../test/mocks/safari'
import { localStorage } from '../test/mocks/localStorage'
import * as browser from 'sinon-chrome/extensions'
import * as chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

;(global as any).chrome = chrome
;(global as any).browser = browser
;(global as any).safari = safari
;(global as any).localStorage = localStorage

beforeEach(() => {
  chrome.flush()
  browser.flush()
  safari.flush()
})
