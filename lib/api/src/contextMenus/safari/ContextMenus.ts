import { NotImplementedException } from '@internal/exceptions'
import { ContextMenus as AbstractContextMenus } from '@internal/contextMenus/ContextMenus'
import { ContextMenuItemConfiguration, ContextMenuItemChangeset } from '@internal/contextMenus/types'

export class ContextMenus extends AbstractContextMenus {

  /**
   * {@inheritdoc}
   */
  public async addItem (configuration: ContextMenuItemConfiguration) : Promise<void> {
    throw new NotImplementedException()
  }

  /**
   * {@inheritdoc}
   */
  public async updateItem (id: string, changeset: ContextMenuItemChangeset) : Promise<void> {
    throw new NotImplementedException()
  }

  /**
   * {@inheritdoc}
   */
  public async removeItem (id: string) : Promise<void> {
    throw new NotImplementedException()
  }

  /**
   * {@inheritdoc}
   */
  public async removeAll () : Promise<void> {
    throw new NotImplementedException()
  }

}
