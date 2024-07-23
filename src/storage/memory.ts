import type { SHashStorageInterface } from '~/SHash'

export class MemoryStorage implements SHashStorageInterface {
  store: Record<string, string> = {}

  async getSalt(partition: string, id: string) { return this.store[`${partition}#${id}`] }
  async setSalt(partition: string, id: string, value: string) { this.store[`${partition}#${id}`] = value }
}
