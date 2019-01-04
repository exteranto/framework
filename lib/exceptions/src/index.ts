export { Handler } from './Handler'

export * from './management'
export * from './tabs'
export * from './compatibility'
export * from './storage'

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
