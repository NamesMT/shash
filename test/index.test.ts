import { describe, expect, it } from 'vitest'
import { SHash } from '~/index'
import { MemoryStorage } from '~/storage/memory'

describe('basic tests', () => {
  it('class SHash should work', async () => {
    expect(SHash).toBeTypeOf('function')

    const helper = new SHash(new MemoryStorage(), str => `${str}2`)

    expect(helper).toMatchObject({
      getHash: expect.any(Function),
      getExistHash: expect.any(Function),
      verifyHash: expect.any(Function),
      verifyExistHash: expect.any(Function),
    })

    // Exist check (should currently not exist)
    await expect(helper.getExistHash('salt', 'partition', 'id')).resolves.toBeUndefined()
    await expect(helper.verifyExistHash('salt', 'partition', 'id', 'saltpartitionid2')).rejects.toThrowError()

    // Create hash check, exist check, verify check
    await expect(helper.getHash('salt', 'partition', 'id')).resolves.toContain('saltpartitionid2')
    await expect(helper.getExistHash('salt', 'partition', 'id')).resolves.toContain('saltpartitionid2')
    const hash = (await helper.getExistHash('salt', 'partition', 'id'))!
    await expect(helper.verifyExistHash('salt', 'partition', 'id', hash)).resolves.toBeUndefined()
    await expect(helper.verifyExistHash('salt', 'partition', 'id', 'saltpartitionid2')).rejects.toThrowError()

    // verifyHash create check
    await expect(helper.verifyHash('salt', 'partition', 'id2', 'saltpartitionid22')).rejects.toThrowError()
    await expect(helper.getExistHash('salt', 'partition', 'id2')).resolves.toContain('saltpartitionid22')

    // validateParams check
    // @ts-expect-error params should be strings
    await expect(helper.getHash(2, 3, 4)).rejects.toThrowError('Invalid partition or id')
  })
})
