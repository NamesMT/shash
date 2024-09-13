import type { SHashStorageInterface } from '~/SHash'

/**
 * This is a simple in-memory storage implementation.
 * 
 * This is not recommended for production use, but it is useful for testing.
 */
export class MemoryStorage implements SHashStorageInterface<string> {
  store: Record<string, string> = {}

  async getSalt(partition: string, id: string) { return this.store[`${partition}#${id}`] }
  async setSalt(partition: string, id: string, value: string | undefined) {
    if (value === undefined)
      delete this.store[`${partition}#${id}`]
    else
      this.store[`${partition}#${id}`] = value
  }
}
