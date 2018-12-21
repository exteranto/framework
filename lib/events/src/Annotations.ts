import { Container } from '@exteranto/ioc'
import { Dispatcher } from './Dispatcher'

/**
 * The @Listen annotation. Create a hook for a specified event.
 *
 * @param {string} event
 * @return {(target: any, method: string) => void}
 */
export function Listen (event: string) : (target: any, method: string) => void {
  return (target: any, method: string) : void => {
    const dispatcher: Dispatcher = Container.resolve(Dispatcher)

    dispatcher.touch(event).addHook((payload: any) => {
      return target[method](payload)
    })
  }
}
