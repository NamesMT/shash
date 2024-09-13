import { describe, expect, it } from 'vitest'
import { MemoryStorage } from './utils/storage/memory'
import { SHash } from '~/index'

describe('basic tests', () => {
  it('basic usages should work', async () => {
    expect(SHash).toBeTypeOf('function')

    const helper = new SHash(
      new MemoryStorage(),
      str => `${str}hola`,
    )

    expect(helper).toMatchObject({
      getHash: expect.any(Function),
      getExistHash: expect.any(Function),
      verifyHash: expect.any(Function),
      verifyExistHash: expect.any(Function),
    })

    // Exist check (should currently not exist)
    await expect(helper.getExistHash('salt', 'partition', 'id')).resolves.toBeUndefined()
    await expect(helper.verifyExistHash('salt', 'partition', 'id', 'saltpartitionhola')).rejects.toThrowError()

    // Create hash check, exist check, verify check
    await expect(helper.getHash('salt', 'partition', 'id')).resolves.toContain('saltpartitionhola')
    await expect(helper.getExistHash('salt', 'partition', 'id')).resolves.toContain('saltpartitionhola')
    const hash = (await helper.getExistHash('salt', 'partition', 'id'))!
    await expect(helper.verifyExistHash('salt', 'partition', 'id', hash)).resolves.toBeUndefined()
    await expect(helper.verifyExistHash('salt', 'partition', 'id', 'saltpartitionhola')).rejects.toThrowError()

    // cleanSalt check
    await expect(helper.cleanSalt('partition', 'id')).resolves.toBeUndefined()
    await expect(helper.getExistHash('salt', 'partition', 'id')).resolves.toBeUndefined()

    // verifyHash create check
    await expect(helper.verifyHash('salt', 'partition', 'idc', 'saltpartitionhola')).rejects.toThrowError()
    await expect(helper.getExistHash('salt', 'partition', 'idc')).resolves.toContain('saltpartitionhola')

    // validateParams check
    // @ts-expect-error params should be strings
    await expect(helper.getHash(2, 3, 4)).rejects.toThrowError('Invalid param: "partition"')
  })

  it('destructured usage should work', async () => {
    const { getHash, getExistHash, verifyHash, verifyExistHash, cleanSalt } = new SHash<string>(
      new MemoryStorage(),
      str => `${str}hola`,
    )

    // Exist check (should currently not exist)
    await expect(getExistHash('salt', 'partition', 'id')).resolves.toBeUndefined()
    await expect(verifyExistHash('salt', 'partition', 'id', 'saltpartitionhola')).rejects.toThrowError()

    // Create hash check, exist check, verify check
    await expect(getHash('salt', 'partition', 'id')).resolves.toContain('saltpartitionhola')
    await expect(getExistHash('salt', 'partition', 'id')).resolves.toContain('saltpartitionhola')
    const hash = (await getExistHash('salt', 'partition', 'id'))!
    await expect(verifyExistHash('salt', 'partition', 'id', hash)).resolves.toBeUndefined()
    await expect(verifyExistHash('salt', 'partition', 'id', 'saltpartitionhola')).rejects.toThrowError()

    // cleanSalt check
    await expect(cleanSalt('partition', 'id')).resolves.toBeUndefined()
    await expect(getExistHash('salt', 'partition', 'id')).resolves.toBeUndefined()

    // verifyHash create check
    await expect(verifyHash('salt', 'partition', 'idc', 'saltpartitionhola')).rejects.toThrowError()
    await expect(getExistHash('salt', 'partition', 'idc')).resolves.toContain('saltpartitionhola')

    // validateParams check
    // @ts-expect-error params should be strings
    await expect(getHash(2, 3, 4)).rejects.toThrowError('Invalid param: "partition"')
  })
})
