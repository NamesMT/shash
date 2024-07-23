import type { SHashStorageInterface } from '~/SHash'

/**
 * This is a simple in-memory storage implementation.
 * 
 * This is not recommended for production use, but it is useful for testing.
 */
export class MemoryStorage implements SHashStorageInterface {
  store: Record<string, string> = {}

  async getSalt(partition: string, id: string) { return this.store[`${partition}#${id}`] }
  async setSalt(partition: string, id: string, value: string) { this.store[`${partition}#${id}`] = value }
}
