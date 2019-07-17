import { Event } from '@exteranto/core'
import { ContextMenuItemClickedEventInfo } from './types'

export class ContextMenuItemClickedEvent extends Event {

  /**
   * @param info The context menu event info
   */
  constructor (public info: ContextMenuItemClickedEventInfo) {
    super()
  }

}
