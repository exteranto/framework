import { Event } from '@exteranto/core'

class WebRequestEvent extends Event {
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

export class ExtensionUpdatedEvent extends Event {
  /**
   * @param previousVersion The previous semantic version
   */
  constructor (public previousVersion: string) {
    super()
  }
}

export class ExtensionInstalledEvent extends Event {
  //
}
