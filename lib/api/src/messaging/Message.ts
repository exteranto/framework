import { Event } from '@exteranto/core'

export class Message extends Event {

  /**
   * The context the message was sent from.
   */
  public context: { tabId?: number }

  /**
   * The respond function.
   */
  public respond: (response: any) => void

  /**
   * @param payload The data this message was sent with
   */
  constructor (public payload?: any) {
    super()
  }

}
