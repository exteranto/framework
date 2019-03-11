import { Extension as AbstractExtension } from '../Extension'

declare var safari: any

export class Extension extends AbstractExtension {

  /**
   * {@inheritdoc}
   */
  public getUrl (path: string = '') : string {
    return `${safari.extension.baseURI}${path}`
  }

}
