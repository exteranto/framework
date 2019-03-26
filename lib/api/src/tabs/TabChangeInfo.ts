
export interface TabChangeInfo {

  /**
   * The status of the tab. Can be either loading or complete.
   */
  status?: 'loading' | 'complete'

  /**
   * The tab's new pinned state.
   * @since Chrome 9.
   */
  pinned?: boolean

  /**
   * The tab's URL if it has changed.
   */
  url?: string

  /**
   * The tab's new audible state.
   * @since Chrome 45.
   */
  audible?: boolean

  /**
   * The tab's new favicon URL.
   * @since Chrome 27.
   */
  favIconUrl?: string

  /**
   * The tab's new title.
   * @since Chrome 48.
   */
  title?: string

}
