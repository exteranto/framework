import { ItemType } from './ItemType'
import { Class } from '@exteranto/core'
import { ContextType } from './ContextType'
import { ContextMenuItemClickedEvent } from './events'

export interface ContextMenuItemChangeset {

  /**
   * The item title.
   */
  title?: string

  /**
   * The type of the item, defaults to NORMAL.
   */
  type?: ItemType

  /**
   * Where this menu item should be shown, defaults to [PAGE].
   */
  contexts?: ContextType[]

  /**
   * Whether the item is checked, only applicable to checkboxes or radios.
   */
  checked?: boolean

  /**
   * Whether the item is visible.
   */
  visible?: boolean

  /**
   * Whether the item is enabled.
   */
  enabled?: boolean

  /**
   * To make an item a child of another item, provide this parameter.
   */
  parentId?: string | number

  /**
   * The event to be fired instead of the default one. Note that this event
   * cannot override the constuctor.
   */
  event?: Class<ContextMenuItemClickedEvent>

}

export interface ContextMenuItemConfiguration extends ContextMenuItemChangeset {

  /**
   * The ID of the item.
   */
  id: string

}

export interface ContextMenuItemClickedEventInfo {

  /**
   * The menu item ID that was clicked.
   */
  menuItemId: string

  /**
   * The parent item ID, if any.
   */
  parentMenuItemId?: string

  /**
   * If the click happened on a media element, this would be the type.
   */
  mediaType?: 'image' | 'video' | 'audio'

  /**
   * If the click happened on a link, this would be the link.
   */
  linkUrl?: string

  /**
   * If the click happened on an element with an src attributed, this would be
   * the value.
   */
  srcUrl?: string

  /**
   * If the event happened on a generic page, this would be its URL.
   */
  pageUrl?: string

  /**
   * If the click happened on a frame, this would be its url.
   */
  frameUrl?: string

  /**
   * The ID of the frame.
   *
   * @see https://developer.chrome.com/apps/webNavigation#frame_ids
   */
  frameId?: number

  /**
   * The text that was selected, if any.
   */
  selectionText?: string

  /**
   * Whether the content of the item is editable (input, textarea...).
   */
  editable: boolean

  /**
   * Whether the item was checked before the event, if it is a checkbox or
   * a radio.
   */
  wasChecked?: boolean

  /**
   * Whether the item is currently checked, if it is a checkbox or a radio.
   */
  checked?: boolean

  /**
   * The ID of the tab the event happened on.
   */
  tabId: number

}
