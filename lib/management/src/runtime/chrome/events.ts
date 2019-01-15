import { Dispatcher, Event } from '@exteranto/events'
import {
  WebRequestBeforeRedirectedEvent,
  WebRequestCompletedEvent,
  ExtensionUpdatedEvent,
  ExtensionInstalledEvent,
} from '../events'

export const register: (dispatcher: Dispatcher) => void = (dispatcher) => {
  chrome.runtime.onInstalled.addListener((event) => {
    const message: () => Event = {
      install: () => new ExtensionInstalledEvent(),
      update: () => new ExtensionUpdatedEvent(event),
    }[event.reason]

    if (!message) {
      return
    }

    dispatcher.mail(message())
  })

  const filter: any = { urls: ['<all_urls>'] }

  chrome.webRequest.onBeforeRedirect.addListener((event) => {
    dispatcher.fire(new WebRequestBeforeRedirectedEvent(event))
  }, filter)

  chrome.webRequest.onCompleted.addListener((event) => {
    dispatcher.fire(new WebRequestCompletedEvent(event))
  }, filter)
}
