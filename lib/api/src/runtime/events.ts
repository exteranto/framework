import { Event } from '@exteranto/core'

/**
 * Parent event for all web request events.
 */
export class WebRequestEvent extends Event {

  /**
   * Tab id this event is bound to.
   *
   * @return Id of tab
   */
  public get tabId () : number {
    return this.data.tabId
  }

  /**
   * The unix time of when the event has been triggered.
   *
   * @return Time of event
   */
  public get timestamp () : number {
    return this.data.timeStamp
  }

  /**
   * @param data Event information
   */
  constructor (public data: any) {
    super()
  }

}

/**
 * Event fired before browser redirect.
 */
export class WebRequestBeforeRedirectedEvent extends WebRequestEvent {

  /**
   * Initial url.
   *
   * @return Valid url string
   */
  public get urlFrom () : string {
    return this.data.url
  }

  /**
   * Requested url.
   *
   * @return Valid url string
   */
  public get urlTo () : string {
    return this.data.redirectUrl
  }

}

/**
 * Event fired after completing a browser redirect.
 */
export class WebRequestCompletedEvent extends WebRequestEvent {

  /**
   * Current tab url.
   *
   * @return Valid url string
   */
  public get url () : string {
    return this.data.url
  }

}

/**
 * Event upon updating the exetension.
 */
export class ExtensionUpdatedEvent extends Event {

  /**
   * @param previousVersion The previous semantic version
   */
  constructor (public previousVersion: string) {
    super()
  }

}

/**
 * Event upon installing the extension.
 */
export class ExtensionInstalledEvent extends Event {
  //
}
