import { Event } from '@exteranto/events'

class WebRequestEvent extends Event {
  /**
   * @inheritdoc
   */
  constructor (protected data?: any) {
    super()
  }

  /**
   * Tab id this event is bound to.
   *
   * @return {number}
   */
  public tabId () : number {
    return this.data.tabId
  }

  /**
   * The unix time of when the event has been triggered.
   *
   * @return {number}
   */
  public timestamp () : number {
    return this.data.timeStamp
  }

  /**
   * Returns the whole data object as in each browser,
   * there's different level of information available.
   *
   * @return {any}
   */
  public raw () : any {
    return this.data
  }
}

export class WebRequestBeforeRedirectedEvent extends WebRequestEvent {
  /**
   * Initial url.
   *
   * @return {string}
   */
  public urlFrom () : string {
    return this.data.url
  }

  /**
   * Requested url.
   *
   * @return {string}
   */
  public urlTo () : string {
    return this.data.redirectUrl
  }
}

export class WebRequestCompletedEvent extends WebRequestEvent {
  /**
   * Current tab url.
   *
   * @return {string}
   */
  public url () : string {
    return this.data.url
  }
}

export class ExtensionUpdatedEvent extends Event {
  /**
   * @inheritdoc
   */
  constructor (protected data?: any) {
    super()
  }

  /**
   * Version of the extension before it was updated
   *
   * @return {string}
   */
  public previousVersion () : string {
    return this.data.previousVersion
  }
}

export class ExtensionInstalledEvent extends Event {
  //
}
