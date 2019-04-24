/// <reference types="chai" />
/// <reference types="node" />
/// <reference types="mocha" />
/// <reference types="chai-as-promised" />

import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

const window: any = {
  addEventListener: (_, l) => l()
}

const document: any = {}

window.top = window

;(global as any).window = window
;(global as any).document = document
