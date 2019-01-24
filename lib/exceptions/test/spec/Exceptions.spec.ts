import { expect } from 'chai'

import * as e from '../../src'

describe('Exceptions package', () => {
  it('exports global/Exception', () => expect(e.Exception).to.be.ok)
  it('exports global/EmptyResponseException', () => expect(e.EmptyResponseException).to.be.ok)
  it('exports global/NotImplementedException', () => expect(e.NotImplementedException).to.be.ok)
  it('exports global/InvalidUrlFormatException', () => expect(e.InvalidUrlFormatException).to.be.ok)
  it('exports compatibility/VersionNotMatchedException', () => expect(e.VersionNotMatchedException).to.be.ok)
  it('exports core/InvalidRouteException', () => expect(e.InvalidRouteException).to.be.ok)
  it('exports permissions/PermissionNotGrantedException', () => expect(e.PermissionNotGrantedException).to.be.ok)
  it('exports cookies/InvalidCookieRequestException', () => expect(e.InvalidCookieRequestException).to.be.ok)
  it('exports tabs/TabIdUnknownException', () => expect(e.TabIdUnknownException).to.be.ok)
  it('exports tabs/OptionIsNoneException', () => expect(e.OptionIsNoneException).to.be.ok)
})
