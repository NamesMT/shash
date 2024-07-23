/**
 * @module SHash
 * Please refer to [SHash.md](./SHash.md) for more information.
 */

export interface SHashStorageInterface {
  getSalt: (partition: string, id: string) => Promise<string | undefined>
  setSalt: (partition: string, id: string, value: string) => Promise<void>
}

/**
 * Main entry of the module, create your SHash helpers with this function.
 * 
 * @param storage - The storage interface, implementing SHashStorageInterface.
 * @param hasher - The hashing algorithm, which should return a string.
 * @returns 
 */
export function createSHashHelper(storage: SHashStorageInterface, hasher: (input: string) => string | Promise<string>) {
  return {
    getHash,
    getExistHash,
    verifyHash,
    verifyExistHash,
  }

  async function getHash(salt: string, partition: string, id: string): Promise<string> {
    return _getHash(salt, partition, id, true) as Promise<string>
  }

  async function getExistHash(salt: string, partition: string, id: string) {
    return _getHash(salt, partition, id, false)
  }

  async function _getHash(salt: string, partition: string, id: string, create = true): Promise<string | undefined> {
    validateParams(partition, id)

    let statefulSalt = await storage.getSalt(partition, id)

    if (!statefulSalt) {
      if (create) {
        await storage.setSalt(partition, id, String(Date.now() + Math.random()))

        statefulSalt = await storage.getSalt(partition, id)
      }
      else {
        return
      }
    }

    return await hasher(`${statefulSalt}${salt}${partition}${id}`)
  }

  async function verifyHash(salt: string, partition: string, id: string, key: string) {
    const hash = await getHash(salt, partition, id)
    if (hash !== key)
      throw new Error('Hash mismatch')
  }

  async function verifyExistHash(salt: string, partition: string, id: string, key: string) {
    const hash = await getExistHash(salt, partition, id)
    if (!hash || hash !== key)
      throw new Error('Hash mismatch')
  }

  function validateParams(partition: string, id: string) {
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
