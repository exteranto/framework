/// <reference types="chai" />
/// <reference types="node" />
/// <reference types="mocha" />
/// <reference types="chai-as-promised" />

import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

;(global as any).window = {
  addEventListener: (_, l) => l()
}
