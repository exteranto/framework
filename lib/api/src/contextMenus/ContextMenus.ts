import { ContextMenuItemClickedEvent } from './events'
import { Autowired, Dispatcher, Class } from '@exteranto/core'
import { ContextMenuItemConfiguration, ContextMenuItemClickedEventInfo, ContextMenuItemChangeset } from './types'

export abstract class ContextMenus {

  /**
   * The event dispatcher implementation.
   */
  @Autowired
  private dispatcher: Dispatcher

  /**
   * Adds an item to context menus in the browser.
   *
   * @param configuration The configuration to be used to create the menu item
   */
  public abstract addItem (configuration: ContextMenuItemConfiguration) : Promise<void>

  /**
   * Updates an context menu item in the browser.
   *
   * @param id The ID of the item to update
   * @param changeset The update changeset
   */
  public abstract updateItem (id: string, changeset: ContextMenuItemChangeset) : Promise<void>

  /**
   * Remove an item from the browser context menus.
   *
   * @param id The ID of the item to remove
   */
  public abstract removeItem (id: string) : Promise<void>

  /**
   * Remove all items added by the extension.
   */
  public abstract removeAll () : Promise<void>

  /**
   * Fire an event notifying that a context menu item was clicked.
   *
   * @param event The event to be fired, if any
   * @param item The item that was clicked
   * @param tab The tab this happened in
   */
  protected fireClickedEvent (
    event: Class<ContextMenuItemClickedEvent>,
    item: any,
    tab: { id?: number },
  ) : void {
    // Build up the info object.
    const info: ContextMenuItemClickedEventInfo = {
      ...item,
      tabId: tab.id,
    }

    // Find the event to be fired.
    const Constructor: Class<ContextMenuItemClickedEvent> = event || ContextMenuItemClickedEvent

    // Fire the event.
    this.dispatcher.fire(new Constructor(info))
  }

}
