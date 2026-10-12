# AGENTS.md

`shash` (SHash — Stateful-salt Hash) is `@namesmt/shash`: a publishable TypeScript library, Node >= 22,
ESM only, `#src/*` → `src/*` alias, [tsdown](https://github.com/rolldown/tsdown) build,
[Vitest](https://vitest.dev) tests. It ships no hashing algorithm — the caller passes a `hasher`, and
SHash wraps it with a stateful salt (plus optional extra salt).

## Docs

Where knowledge lives, and when to reach for each:

| tier | what it holds | when you use it |
| --- | --- | --- |
| `AGENTS.md` — this file | orientation and the rules that prevent defects | read every session; write when a rule is learned the hard way |
| `.agentDocs/` | depth: module rationale, traps with their causes, compatibility | read on demand, before touching that area; write when a rule needs its reasoning kept |
| `docs/` | how-to and reference for a person using this package | read when the task is user-facing; write in the same commit as the change |
| `README.md` | the first read, for a person | write alongside `docs/` |

- **One home per fact.** State the rule here, keep the reasoning in `.agentDocs/` and link it — never both.
- **A dead pointer is a bug.** If the target is gone, delete the pointer rather than leave it.
- Move depth behind a pointer once a section outgrows a screen or two; keep the rule inline.

## Commands

```sh
pnpm run lint                  # eslint (@antfu/eslint-config) — it also owns formatting
pnpm run test                  # vitest in watch mode
pnpm run test:types            # tsc --noEmit --skipLibCheck (playground excluded; hides dep type errors)
pnpm run check                 # lint + test:types + vitest run --coverage; the release gate
pnpm run build                 # tsdown -> dist/index.mjs + dist/index.d.mts
pnpm run release:check 0.3.8   # version must parse and be greater than package.json's
pnpm run release:preview       # changelog for unreleased commits (changelogen)
pnpm run start                 # NODE_ENV=dev tsx src/index.ts — no watch
pnpm run watch                 # NODE_ENV=dev tsx watch src/index.ts
pnpm run dev             # alias of `pnpm run watch`
```

## Structure

- `src/index.ts` re-exports `SHash` and `SHashStorageInterface` from `src/SHash.ts`; `src/utils.ts` is
  `validParams`; tests import the source via `#src/*`.
- `test/index.test.ts` — the only test file, backed by `test/utils/storage/memory.ts`.
- `exports`/`main`/`module`/`types` point at `dist/`, `source` at `src/index.ts`.
- `playground/` — private pnpm workspace package (Vite + nodemon) using the lib via `workspace:^`.
- `test.yml` tests pushes/PRs on Node 22 (+ Codecov); `release.yml` is the manual release on Node 24.

## Conventions

- Conventional commits (`feat:`, `fix:`, `chore:`, …) — the changelog derives from them.
- ESLint (`@antfu/eslint-config`) owns lint and formatting.
- `simple-git-hooks` pre-commit runs `lint-staged` → `eslint --fix`; run `pnpm run lint` before
  claiming a change is clean.
- ESM only: `"type": "module"` with an import-only `exports` map. Do not add a CJS build.
- Comments are sparse — intent, not mechanics; the public API carries JSDoc. `validParams` requires
  `id` truthy and every other parameter to be a non-empty string.

## How to work here

- **Check the callers before you change anything.** Grep who uses it and which tests name it. If the
  impact is unclear, say so — do not guess.
- **Never overwrite or delete a large section you have not understood.** Read it, or say what you could
  not determine and ask.
- **Do not invent requirements.** Build what was asked; surface what else you notice and let it be
  decided.
- **Fix the class, not the instance.** A copied helper, a rule stated twice, a guard bypassed by a
  second path is one problem: one implementation, one guard. That is the work, not a follow-up to ask
  for. Stay inside the task rather than refactoring the world.
- **Verify before claiming, and say what you checked.** A passing test is not evidence it pins
  anything — **break the thing it guards and watch it fail.** If it still passes, either the test is
  decoration or a different guard is running; find out which. Where a stub cannot answer the question,
  drive the real thing.
- **Never write an identifier from memory.** A commit hash, path, line number or version must be quoted
  from the source; a plausible-looking invented one is worse than none.
- **A stated blocker is a hypothesis, not a fact.** Re-test "cannot install X" / "tool unavailable"
  before inheriting it, and never report a failure your own flag forced.
- **Report the risk with the change** — correctness, security, operational and integration; plus what
  you could not verify and every assumption you made. An unverified claim marked as such beats a
  confident one that is wrong.
- **Missing recall of this repo?** Read this file, `.agentDocs/` and `git log` before acting, then ask
  1–3 focused questions rather than guessing at intent.
- The tests assert one invalid param, not every guard.

## Conciseness

**Prune verbose, keep correctness** — code, comments, docs alike.

- Code: a comment only for non-obvious *intent*, never to restate the line, and never long. A block
  arguing for its own change is a commit message.
- Docs: one idea per sentence. Cut anything that would not change what a reader does.
- Delete history `git log` already holds — keep the *rule* that came out of it, not the story.
- **Never drop a caveat to save a line.** Concise means no filler, not fewer facts.

## User-facing docs

`README.md` is the only user-facing doc here — there is no `docs/`. Keep it a **concise first read**;
put depth in `<details>` spoilers and add visuals where they help. It ships with the change, in the same commit.

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
