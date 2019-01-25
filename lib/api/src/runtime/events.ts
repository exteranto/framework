import { Event } from '@exteranto/core'

class WebRequestEvent extends Event {
  /**
   * Tab id this event is bound to.
   *
   * @return {number}
   */
  public get tabId () : number {
    return this.data.tabId
  }

  /**
   * The unix time of when the event has been triggered.
   *
   * @return {number}
   */
  public get timestamp () : number {
    return this.data.timeStamp
  }

  /**
   * Class constructor.
   *
   * @param {any} data
   */
  constructor (public data: any) {
    super()
  }
}

export class WebRequestBeforeRedirectedEvent extends WebRequestEvent {
  /**
   * Initial url.
   *
   * @return {string}
   */
  public get urlFrom () : string {
    return this.data.url
  }

  /**
   * Requested url.
   *
   * @return {string}
   */
  public get urlTo () : string {
    return this.data.redirectUrl
  }
}

export class WebRequestCompletedEvent extends WebRequestEvent {
  /**
   * Current tab url.
   *
   * @return {string}
   */
  public get url () : string {
    return this.data.url
  }
}

export class ExtensionUpdatedEvent extends Event {
  /**
   * Class constructor.
   *
   * @param {string} previousVersion
   */
  constructor (public previousVersion: string) {
    super()
  }
}

export class ExtensionInstalledEvent extends Event {
  //
}
