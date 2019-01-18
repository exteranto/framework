import { Event } from '@exteranto/core'

export class Message extends Event {
  /**
   * The context the message was sent from.
   *
   * @var {any}
   */
  public context: any

  /**
   * The respond function.
   *
   * @var {(response: any) => any}
   */
  public respond: (response: any) => any

  /**
   * @param {payload} payload
   */
  constructor (public payload: any) {
    super()
  }
}
