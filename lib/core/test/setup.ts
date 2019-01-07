/// <reference types="mocha" />
/// <reference types="chai" />
/// <reference types="node" />

;(global as any).window = {
  addEventListener: (_, l) => l()
}
