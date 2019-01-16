
export const safari: any = {
  application: {
    activeBrowserWindow: {} as any,
    browserWindows: [],
    addEventListener: (event: string, cb: (details: any) => void) : void => {}
  },
  extension: {
    baseURI: 'safari-extension://abc/',
    toolbarItems: []
  }
}
