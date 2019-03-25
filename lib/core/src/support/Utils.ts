import { Browser } from './Browser'

export class Utils {

  /**
   * Determine what browser are we in at the moment.
   *
   * @return The current browser
   */
  public static currentBrowser () : Browser {
    if (typeof window === 'undefined') {
      return Browser.TESTING
    }

    return (window as any).browser !== undefined ? Browser.EXTENSIONS
      : (window as any).safari === undefined ? Browser.CHROME
      : Browser.SAFARI
  }

}
