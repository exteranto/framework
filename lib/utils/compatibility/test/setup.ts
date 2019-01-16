/// <reference types="mocha" />
/// <reference types="chai" />
/// <reference types="chai-as-promised" />
/// <reference types="node" />

import * as chai from "chai"
import * as chaiAsPromised from "chai-as-promised"
import { App } from '@exteranto/core'
import { Script } from '@exteranto/support'

chai.use(chaiAsPromised);

;(global as any).window = {
  addEventListener: (_, l) => l()
}

const app: App = new App(Script.BACKGROUND, { providers: [] }, () => {})

app.start()
app.boot()
