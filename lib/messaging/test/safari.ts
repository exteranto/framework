import * as sinon from 'sinon'

export const safari = {
  application: {
    addEventListener: sinon.spy()
  },

  self: {
    tab: {
      dispatchMessage: sinon.spy()
    }
  }
}
