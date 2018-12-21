import { Browser } from './Browser'

export class Utils {
  /**
   * Determine what browser are we in at the moment.
   *
   * @return {Browser}
   */
  public static currentBrowser () : Browser {
    if (typeof window === 'undefined') {
      return Browser.TESTING
    }

    return (window as any).chrome === undefined ? (window as any).safari === undefined
      ? Browser.EXTENSIONS
      : Browser.SAFARI
      : Browser.CHROME
  }
}
