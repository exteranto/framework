import { Event } from '@internal/events'

/**
 * The window loaded event is fired after the native window.load event is
 * triggered. This event has no payload.
 */
export class WindowLoadedEvent extends Event {
  //
}

/**
 * This event is fired after the application has been successfully booted. This
 * should be the listener of choice for custom application logic to boot.
 */
export class AppBootedEvent extends Event {
  //
}
