export { Handler } from './Handler'

export * from './core'
export * from './tabs'
export * from './storage'
export * from './management'
export * from './compatibility'

export class EmptyResponseException extends Error {
  //
}

export class NotImplementedException extends Error {
  constructor (...args: string[]) {
    super(args.join(','))
  }
}

export class InvalidUrlFormatException extends Error {
  //
}
