/**
 * @module SHash
 * Please refer to [SHash.md](./SHash.md) for more information.
 */

export interface SHashStorageInterface {
  getSalt: (partition: string, id: string) => Promise<string | undefined>
  setSalt: (partition: string, id: string, value: string) => Promise<void>
}

/**
 * Main entry of the module, create your SHash helpers with this class.
 * 
 * @param storage - The storage interface, implementing SHashStorageInterface.
 * @param hasher - The hashing algorithm, which should return a string.
 */
export class SHash {
  constructor(private storage: SHashStorageInterface, private hasher: (input: string) => string | Promise<string>) { }

  /**
   * Get a hash for a given partition and id, create if not exists.
   */
  getHash = async (salt: string, partition: string, id: string): Promise<string> => {
    return this._getHash(salt, partition, id, true) as Promise<string>
  }

  /**
   * Get existing hash for a given partition and id.
   */
  getExistHash = async (salt: string, partition: string, id: string) => {
    return this._getHash(salt, partition, id, false)
  }

  verifyHash = async (salt: string, partition: string, id: string, key: string) => {
    const hash = await this.getHash(salt, partition, id)
    if (hash !== key)
      throw new Error('Hash mismatch')
  }

  verifyExistHash = async (salt: string, partition: string, id: string, key: string) => {
    const hash = await this.getExistHash(salt, partition, id)
    if (!hash || hash !== key)
      throw new Error('Hash mismatch')
  }

  private _getHash = async (salt: string, partition: string, id: string, create = true): Promise<string | undefined> => {
    this._validateParams(partition, id)

    let statefulSalt = await this.storage.getSalt(partition, id)

    if (!statefulSalt) {
      if (create) {
        await this.storage.setSalt(partition, id, String(Date.now() + Math.random()))

        statefulSalt = await this.storage.getSalt(partition, id)
      }
      else {
        return
      }
    }

    return await this.hasher(`${statefulSalt}${salt}${partition}${id}`)
  }

  private _validateParams(partition: string, id: string) {
    if (0
      || typeof partition !== 'string'
      || typeof id !== 'string'
      || partition.length === 0
      || id.length === 0
    ) {
      throw new Error('Invalid partition or id')
    }
  }
}
