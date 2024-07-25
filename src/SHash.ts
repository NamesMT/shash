/**
 * @module SHash
 */

import { validParams } from './utils'

export interface SHashStorageInterface {
  /**
   * Get the salt of the given partition and id.
   */
  getSalt: (partition: string, id: string) => Promise<string | undefined>

  /**
   * Set the salt for the given partition and id.
   */
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
   * Get a hash for a given partition and id.  
   * Will creates the hash if not exist.
   */
  getHash = async (salt: string, partition: string, id: string): Promise<string> => {
    return this._getHash(salt, partition, id, true) as Promise<string>
  }

  /**
   * Get existing hash of the a given partition and id.
   */
  getExistHash = async (salt: string, partition: string, id: string) => {
    return this._getHash(salt, partition, id, false)
  }

  /**
   * Get hash of the given partition and id, then verify it with the given key.  
   * Will creates the hash if not exist.
   * 
   * Throw when the hash does not match the given key.
   */
  verifyHash = async (salt: string, partition: string, id: string, key: string) => {
    const hash = await this.getHash(salt, partition, id)
    if (hash !== key)
      throw new Error('Hash mismatch')
  }

  /**
   * Get existing hash of the given partition and id, then verify it with the given key.
   * 
   * Throw when the hash does not exist or does not match the given key.
   */
  verifyExistHash = async (salt: string, partition: string, id: string, key: string) => {
    const hash = await this.getExistHash(salt, partition, id)
    if (!hash || hash !== key)
      throw new Error('Hash mismatch')
  }

  private _getHash = async (salt: string, partition: string, id: string, create = true): Promise<string | undefined> => {
    validParams(partition, id)

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
}
