import { Event } from '@exteranto/core'

class WebRequestEvent extends Event {
  /**
   * Class constructor.
   *
   * @param {any} data
   */
  constructor (public data: any) {
    super()
  }

  /**
   * Tab id this event is bound to.
   *
   * @return {number}
   */
  public getTabId () : number {
    return this.data.tabId
  }

  /**
   * The unix time of when the event has been triggered.
   *
   * @return {number}
   */
  public getTimestamp () : number {
    return this.data.timeStamp
  }
}

export class WebRequestBeforeRedirectedEvent extends WebRequestEvent {
  /**
   * Initial url.
   *
   * @return {string}
   */
  public getUrlFrom () : string {
    return this.data.url
  }

  /**
   * Requested url.
   *
   * @return {string}
   */
  public getUrlTo () : string {
    return this.data.redirectUrl
  }
}

export class WebRequestCompletedEvent extends WebRequestEvent {
  /**
   * Current tab url.
   *
   * @return {string}
   */
  public getUrl () : string {
    return this.data.url
  }
}

export class ExtensionUpdatedEvent extends Event {
  /**
   * Class constructor.
   *
   * @param {string} previousVersion
   */
  constructor (private previousVersion: string) {
    super()
  }

  /**
   * Version of the extension before it was updated
   *
   * @return {string}
   */
  public getPreviousVersion () : string {
    return this.previousVersion
  }
}

export class ExtensionInstalledEvent extends Event {
  //
}
