# shash ![TypeScript heart icon](https://img.shields.io/badge/♡-%23007ACC.svg?logo=typescript&logoColor=white)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Codecov][codecov-src]][codecov-href]
[![Bundlejs][bundlejs-src]][bundlejs-href]
[![jsDocs.io][jsDocs-src]][jsDocs-href]

**shash** (SHash)

SHash is not a cryptographic hashing algorithm, it is a collection of hashing helpers.

The S in SHash stands for Stateful.

SHash requires a storage interface to be passed in, which is used to store the stateful salt.

SHash aims to be simple and easy to use, to help you implement a hash secret with multiple layers of security:  
SHash is stateful, which means that there is a layer of database/storage.  
SHash allows you to specify your additional salt, which could add two layers: hard-coded salt and environment salt.  

SHash supports any hashing algorithm, it is recommended to use SHA256 for the balance of security and performance,  
Do note that SHA256 is NOT SAFE for highly sensitive information like passwords, because it is relatively fast and easier for an attacker to crack your passwords in case of a full breach of all layers.

## Features
- [x] TypeScript ready!

## Usage
### Install package:
```sh
# npm
npm install shash

# yarn
yarn add shash

# pnpm (recommended)
pnpm install shash
```

### Import:
```ts
// ESM
import { hello } from 'shash'
```

## Roadmap

- [x] Setting up Dev Container
- [ ] Become the legendary 10000x developer

## License [![License][license-src]][license-href]
[MIT](./LICENSE) License © 2023 [NamesMT](https://github.com/NamesMT)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/shash?labelColor=18181B&color=F0DB4F
[npm-version-href]: https://npmjs.com/package/shash
[npm-downloads-src]: https://img.shields.io/npm/dm/shash?labelColor=18181B&color=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/shash
[codecov-src]: https://img.shields.io/codecov/c/gh/namesmt/shash/main?labelColor=18181B&color=F0DB4F
[codecov-href]: https://codecov.io/gh/namesmt/shash
[license-src]: https://img.shields.io/github/license/namesmt/shash.svg?labelColor=18181B&color=F0DB4F
[license-href]: https://github.com/namesmt/shash/blob/main/LICENSE
[bundlejs-src]: https://img.shields.io/bundlejs/size/shash?labelColor=18181B&color=F0DB4F
[bundlejs-href]: https://bundlejs.com/?q=shash
[jsDocs-src]: https://img.shields.io/badge/Check_out-jsDocs.io---?labelColor=18181B&color=F0DB4F
[jsDocs-href]: https://www.jsdocs.io/package/shash
