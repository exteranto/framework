import * as sinon from 'sinon'

class Safari {
  private stubs = []
  private listeners = {}

  public init () {
    return {
      application: {
        activeBrowserWindow: {} as any,
        browserWindows: [],
        addEventListener: this.stub().callsFake((name, cb) => {
          this.listeners[name] === undefined
            ? this.listeners[name] = [cb]
            : this.listeners[name].push(cb)
        }),
        trigger: (event, payload) => {
          (this.listeners[event] || []).forEach(l => l(payload))
        }
      },
      extension: {
        baseURI: 'safari-extension://abc/',
        toolbarItems: []
      },
      self: {
        tab: {
          dispatchMessage: this.stub()
        }
      },
      flush: () => {
        this.stubs.forEach(s => s.resetHistory())
        this.listeners = {}
      }
    }
  }

  private stub () {
    const stub = sinon.stub()
    this.stubs.push(stub)
    return stub
  }
}

export const safari = new Safari().init()
