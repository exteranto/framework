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

    // Some checking logic for browsers.
    const extensions: boolean = typeof (window as any).InstallTrigger !== 'undefined'
      || (!(document as any).documentNode && (window as any).StyleMedia)

    const chrome: boolean = !!(window as any).chrome
      && (!!(window as any).chrome.webstore || !!(window as any).chrome.runtime)

    return extensions ? Browser.EXTENSIONS
      : chrome ? Browser.CHROME
      : Browser.SAFARI
  }

}
