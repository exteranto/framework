import { ContextMenus as AbstractContextMenus } from '@internal/contextMenus/ContextMenus'
import { ContextMenuItemConfiguration, ContextMenuItemChangeset } from '@internal/contextMenus/types'

import {
  ContextMenuItemUpdateFailedException,
  ContextMenuItemCreationFailedException,
  ContextMenuItemDeletionFailedException,
} from '@internal/contextMenus/exceptions'

export class ContextMenus extends AbstractContextMenus {

  /**
   * {@inheritdoc}
   */
  public async addItem (configuration: ContextMenuItemConfiguration) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      browser.menus.create({
        checked: configuration.checked,
        contexts: configuration.contexts as any,
        enabled: configuration.enabled,
        id: configuration.id,
        onclick: (item, tab) => this.fireClickedEvent(configuration.event, item, tab),
        parentId: configuration.parentId,
        title: configuration.title,
        type: configuration.type,
        visible: configuration.visible,
      }, () => browser.runtime.lastError
        ? reject(new ContextMenuItemCreationFailedException())
        : resolve(),
      )
    })
  }

  /**
   * {@inheritdoc}
   */
  public async updateItem (id: string, changeset: ContextMenuItemChangeset) : Promise<void> {
    await browser.menus.update(id, {
      checked: changeset.checked,
      contexts: changeset.contexts as any,
      enabled: changeset.enabled,
      onclick: changeset.event ? (item, tab) => this.fireClickedEvent(changeset.event, item, tab) : undefined,
      parentId: changeset.parentId,
      title: changeset.title,
      type: changeset.type,
    }).catch(() => Promise.reject(new ContextMenuItemUpdateFailedException()))
  }

  /**
   * {@inheritdoc}
   */
  public async removeItem (id: string) : Promise<void> {
    await browser.menus.remove(id)
      .catch(() => Promise.reject(new ContextMenuItemDeletionFailedException()))
  }

  /**
   * {@inheritdoc}
   */
  public async removeAll () : Promise<void> {
    await browser.menus.removeAll()
      .catch(() => Promise.reject(new ContextMenuItemDeletionFailedException()))
  }

}
