# AGENTS.md

`shash` (SHash — Stateful-salt Hash) is `@namesmt/shash`: a publishable TypeScript library, Node >= 22,
ESM only, `#src/*` → `src/*` alias, [tsdown](https://github.com/rolldown/tsdown) build,
[Vitest](https://vitest.dev) tests. It ships no hashing algorithm — the caller passes a `hasher`, and
SHash wraps it with a stateful salt (plus optional extra salt).

## Commands

```sh
pnpm run lint                  # eslint (@antfu/eslint-config) — it also owns formatting
pnpm run test                  # vitest in watch mode
pnpm run test:types            # tsc --noEmit --skipLibCheck (playground excluded; hides dep type errors)
pnpm run check                 # lint + test:types + vitest run --coverage; the release gate
pnpm run build                 # tsdown -> dist/index.mjs + dist/index.d.mts
pnpm run release:check 0.3.8   # version must parse and be greater than package.json's
pnpm run release:preview       # changelog for unreleased commits (changelogen)
pnpm run dev                   # tsx watch on src/index.ts (alias of `watch`)
```

## Structure

- `src/index.ts` re-exports `SHash` and `SHashStorageInterface` from `src/SHash.ts`; `src/utils.ts` is
  `validParams`; tests import the source via `#src/*`.
- `test/index.test.ts` — the only test file, backed by `test/utils/storage/memory.ts`.
- `tsdown.config.ts` emits bundle + types to `dist/`; `exports`/`main`/`module`/`types` point at
  `dist/`, `source` at `src/index.ts`.
- `playground/` — private pnpm workspace package (Vite + nodemon) using the lib via `workspace:^`.
- `test.yml` tests pushes/PRs on Node 22 (+ Codecov); `release.yml` is the manual release on Node 24.

## Conventions

- Conventional commits (`feat:`, `fix:`, `chore:`, …) — the changelog derives from them.
- ESLint `@antfu/eslint-config` owns formatting (no Prettier, single quotes, 2-space, sorted imports);
  it allows trailing spaces in comments (JSDoc, off in markdown) and raises `max-statements-per-line` to 2.
- `simple-git-hooks` pre-commit runs `lint-staged` → `eslint --fix`; run `pnpm run lint` before
  claiming a change is clean.
- ESM only: `"type": "module"` with an import-only `exports` map. Do not add a CJS build.
- Comments are sparse — intent, not mechanics; the public API carries JSDoc. `validParams` requires
  `id` truthy and every other parameter to be a non-empty string.

## Releasing

Manual and version-first: **Actions → Release → Run workflow** with the version. `release.yml` is the
only publish path — a pushed tag publishes nothing. `dry-run` skips only the push, GitHub release and
npm publish; changelogen still bumps `package.json`, writes `CHANGELOG.md` and creates the commit and
tag on the runner. One-time trusted-publisher setup is in `release.yml`'s header comment.

## Gotchas

- The release gate is `pnpm run check`; `test.yml` runs `pnpm test --coverage`, which skips watch mode
  only because CI is set — use `pnpm run check` locally for one-shot tests.
- `src/SHash.ts` calls global `crypto.randomUUID()` with no import, relying on Node's webcrypto
  global; that is why `engines.node` is `>=22`.
- `id` never enters the digest — `_getHash` hashes `${statefulSalt}${salt}${partition}`; `id` only selects the stored salt.
- `getExistHash` resolves to `undefined` when no salt exists; `verifyExistHash` throws `Hash mismatch` for both a missing and a mismatched key.
- `dist/` is gitignored and rebuilt by `prepublishOnly` before any publish.

## How to work here

- Check the callers before you change it; say when the impact is unclear rather than guessing. Never
  overwrite or delete a large section you have not understood; do not invent requirements — surface
  what looks needed.
- Report the risk, not only the change — correctness, security, operational, integration.
- **Fix the root cause, not the instance.** The same bug under a different name — a copied helper, a
  rule stated twice, a guard bypassed by a second path — means fix the class: one implementation, one
  guard. That is the work, not a follow-up to ask for.
- Verify before claiming, and say which direction you checked. Green is not proof it pinned anything:
  the tests assert one invalid param, not every guard.
- If recall of this project is missing, read this file and `git log` before acting.

## Conciseness (applies everywhere)

Prune verbose, keep correctness — code, comments, docs alike. Code: a comment only for non-obvious
intent. Docs: one idea per sentence; cut what would not change what a reader does. Delete history
`git log` already holds — keep the rule, not the story. Never drop a caveat to save a line.

## User-facing docs

`README.md` is the only user-facing doc here — there is no `docs/`. Keep it a **concise first read**;
put depth in `<details>` spoilers and add visuals where they help. It ships with the change, in the same commit.
