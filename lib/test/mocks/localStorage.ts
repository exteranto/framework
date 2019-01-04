
export const localStorage = {
  items: {},

  length: 0,

  getItem (key) {
    return this.items[key]
  },

  setItem (key, value) {
    this.items[key] = value
    this.length = Object.keys(this.items).length
  },

  removeItem (key) {
    delete this.items[key]
    this.length = Object.keys(this.items).length
  },

  key (index) {
    return Object.keys(this.items)[index]
  },

  clear () {
    this.items = {}
    this.length = 0
  }
}
