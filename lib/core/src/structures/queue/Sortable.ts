
export interface Sortable {

  /**
   * Compares "this" to another sortable "a".
   * Should return 1 if "this" is larger,
   * 0 if they're equal and -1 if "a" is larger.
   *
   * @param {Sortable} a
   */
  comp (a: Sortable) : number
}
