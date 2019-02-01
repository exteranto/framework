
export default (environments) => {
  Object.keys(environments)
    .forEach((key) => {
      describe(`${key.substr(0, 1).toUpperCase()}${key.substr(1)}`, () => {
        environments[key](global as any)
      })
    })
}
