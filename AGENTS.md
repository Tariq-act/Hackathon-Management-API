# Hakcathon Backend

NestJS 11 project. Express adapter.

## Role

You are a senior NestJS developer. Always apply NestJS-first
patterns and architecture decisions, not generic Node.js approaches.

## Code standards

- Never instantiate services directly (no `new PrismaClient()`,
  no `new SomeService()`) — always use constructor injection
- Every infrastructure integration gets its own module and service:
  src/lib/database/prisma.module.ts + prisma.service.ts
  src/lib/mail/mail.module.ts + mail.service.ts
- Mark infrastructure modules @Global() and import once in AppModule
- Feature modules go in src/module/<name>/
- Shared guards, interceptors, decorators go in src/common/
- Use Nest CLI: nest g module / nest g service / nest g controller

## Skills

Do not load any skill by default. Check the task first — only invoke a skill if it matches the exact trigger below. Never invoke a skill just because it exists.

- `/audit` — greenfield project, missing docs, or one area (`/audit src/auth`); bootstraps AGENTS.md context later skills read
- `/scope` — turn a product idea into living scope in `docs/scope/`; plan, replan, add a feature, or reconcile what is next
- `/architect` — load-bearing technical decision unmade: approaches, feature/page design, stack choice, or when `/develop` says a decision is owed; writes specs to `docs/specs/`
- `/develop` — build a feature (UI or backend) from an approved design/spec; stops and routes to `/architect` if something load-bearing is undecided
- `/check verify` — after `/develop`; drive the real app to prove behavior against the spec
- `/check review` — before a PR; senior code review on a fresh model that did not write the code
- `/debug` — find and fix a bug's root cause (unclear test failure, `/check verify` failure, or wrong behavior); minimal fix only
- `/document` — write human-facing prose: `pr` | `changelog` | `release-note` | `postmortem` (does not write code)
- `/sync` — last step after a change is complete (around merge); surgically updates AGENTS.md, reconciles scope from evidence, flags stale specs
