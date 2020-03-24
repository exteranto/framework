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

    // Some checking logic for browsers; prioritise duck-typing over User-Agent string.
    // Methods are borrowed from the following SO resource which is regularly updated:
    // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser#9851769

    const chrome: boolean = !!(window as any).chrome
      && (!!(window as any).chrome.webstore || !!(window as any).chrome.runtime)

    const edge: boolean = chrome && (navigator.userAgent.indexOf('Edg') !== -1)

    const extensions: boolean = typeof (window as any).InstallTrigger !== 'undefined'
      || (!(document as any).documentNode && (window as any).StyleMedia)

    const opera: boolean = (!!(window as any).opr && !!(window as any).addons)
      || !!(window as any).opera || navigator.userAgent.indexOf(' OPR/') >= 0

    // Currently we will not return `Browser.OPERA` but fall back to `.CHROME`
    return extensions ? Browser.EXTENSIONS
      : edge ? Browser.EDGE
      : chrome ? Browser.CHROME
      : Browser.SAFARI
  }

}
