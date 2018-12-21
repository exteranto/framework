/// <reference types="mocha" />
/// <reference types="chai" />
/// <reference types="chai-as-promised" />

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { App } from '@exteranto/core'
import { Script } from '@exteranto/support'

chai.use(chaiAsPromised);

new App(Script.BACKGROUND, {
  providers: [],
  bound: {
    cache: { driver: 'local', timeout: 1 }
  }
}, {}).bootstrap()
