# shash ![TypeScript heart icon](https://img.shields.io/badge/♡-%23007ACC.svg?logo=typescript&logoColor=white)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Codecov][codecov-src]][codecov-href]
[![Bundlejs][bundlejs-src]][bundlejs-href]
[![jsDocs.io][jsDocs-src]][jsDocs-href]

**shash** (SHash - Stateful-salt Hash)

SHash is not a cryptographic hashing algorithm, it is a collection of helpers to implement a hash secret system with multiple layers of security.

SHash requires a storage interface to be passed in, which is used to store the stateful salt.

SHash aims to be simple and easy to use, to help you implement a hash secret with multiple layers of security:  
SHash stores a stateful salt, which means that there is a layer of database/storage.  
SHash allows you to specify your additional salt, which could add two layers: hard-coded salt and environment salt.  
The hashed value is calculated as needed with all the salts and is not stored.  

SHash supports any hashing algorithm, it is recommended to use SHA256 for the balance of security and performance,  
Do note that SHA256 is NOT SAFE for highly sensitive information like passwords, because it is relatively fast and easier for an attacker to crack your passwords in case of a full breach of all layers.

Note: Hashing algorithm is not included in this package, you can use any hashing algorithm you want.

## Features
- [x] TypeScript ready!

## Usage
### Install package:
```sh
# npm
npm install @namesmt/shash

# yarn
yarn add @namesmt/shash

# pnpm (recommended)
pnpm install @namesmt/shash
```

### Import and use:
```ts
// ESM
import { SHash } from '@namesmt/shash'

/**
 * This is a simple in-memory storage implementation.
 * 
 * This is not recommended for production use, but it is useful for testing.
 */
class MemoryStorage implements SHashStorageInterface {
  store: Record<string, string> = {}

  async getSalt(partition: string, id: string) { return this.store[`${partition}#${id}`] }
  async setSalt(partition: string, id: string, value: string | undefined) {
    if (value === undefined)
      delete this.store[`${partition}#${id}`]
    else
      this.store[`${partition}#${id}`] = value
  }
}

// A simple hash function for demo purposes
function demoHash(str: string) {
  return `${str}-demohashed`
}

const {
  getHash, // getHash will create a new salt for the partition and id if it does not exist.
  getExistHash, // getExistHash only returns the hash if it the stateful salt exists.
  verifyHash, // verify functions will call get* under-the-hood and then verify it with the given key, throws if it does not match.
  verifyExistHash,
  cleanSalt, // cleanSalt will remove the stateful salt for the partition and id.
} = new SHash(new MemoryStorage(), demoHash) // You could pass in any hashing algorithm

// It is recommended to use a hybrid salt from environment variable and hard-coded like: `salted${env.SECRET_SAUCE}`
const hash = await getHash('salt', 'partition', 'id')
```

## Roadmap
- [ ] Become the legendary 10000x developer

## License [![License][license-src]][license-href]
[MIT](./LICENSE) License © 2024 [NamesMT](https://github.com/NamesMT)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@namesmt/shash?labelColor=18181B&color=F0DB4F
[npm-version-href]: https://npmjs.com/package/@namesmt/shash
[npm-downloads-src]: https://img.shields.io/npm/dm/@namesmt/shash?labelColor=18181B&color=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/@namesmt/shash
[codecov-src]: https://img.shields.io/codecov/c/gh/namesmt/shash/main?labelColor=18181B&color=F0DB4F
[codecov-href]: https://codecov.io/gh/namesmt/shash
[license-src]: https://img.shields.io/github/license/namesmt/shash.svg?labelColor=18181B&color=F0DB4F
[license-href]: https://github.com/namesmt/shash/blob/main/LICENSE
[bundlejs-src]: https://img.shields.io/bundlejs/size/@namesmt/shash?labelColor=18181B&color=F0DB4F
[bundlejs-href]: https://bundlejs.com/?q=@namesmt/shash
[jsDocs-src]: https://img.shields.io/badge/Check_out-jsDocs.io---?labelColor=18181B&color=F0DB4F
[jsDocs-href]: https://www.jsdocs.io/package/@namesmt/shash
