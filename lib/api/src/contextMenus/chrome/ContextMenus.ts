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
      chrome.contextMenus.create({
        checked: configuration.checked,
        contexts: configuration.contexts,
        enabled: configuration.enabled,
        id: configuration.id,
        onclick: (item, tab) => this.fireClickedEvent(configuration.event, item, tab),
        parentId: configuration.parentId,
        title: configuration.title,
        type: configuration.type,
        visible: configuration.visible,
      }, () => chrome.runtime.lastError
        ? reject(new ContextMenuItemCreationFailedException())
        : resolve(),
      )
    })
  }

  /**
   * {@inheritdoc}
   */
  public async updateItem (id: string, changeset: ContextMenuItemChangeset) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      chrome.contextMenus.update(id as any, {
        checked: changeset.checked,
        contexts: changeset.contexts,
        enabled: changeset.enabled,
        onclick: changeset.event ? (item, tab) => this.fireClickedEvent(changeset.event, item, tab) : undefined,
        parentId: changeset.parentId,
        title: changeset.title,
        type: changeset.type,
      }, () => chrome.runtime.lastError
        ? reject(new ContextMenuItemUpdateFailedException())
        : resolve(),
      )
    })
  }

  /**
   * {@inheritdoc}
   */
  public async removeItem (id: string) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      chrome.contextMenus.remove(id, () => chrome.runtime.lastError
        ? reject(new ContextMenuItemDeletionFailedException())
        : resolve(),
      )
    })
  }

  /**
   * {@inheritdoc}
   */
  public async removeAll () : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      chrome.contextMenus.removeAll(() => chrome.runtime.lastError
        ? reject(new ContextMenuItemDeletionFailedException())
        : resolve(),
      )
    })
  }

}
