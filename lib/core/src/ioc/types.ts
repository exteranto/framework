
/**
 * Custom constructor types.
 */
export type Class<T> = new (...args: any[]) => T
export type Abstract<T> = Function & { prototype: T }
