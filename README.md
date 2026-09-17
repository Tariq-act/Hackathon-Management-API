# Hackathon API

NestJS backend for browsing hackathons, admin management, and participant joins. Auth is Better Auth (email/password) with roles `ADMIN` and `PARTICIPANT`.

## Stack

- NestJS 12 + Express
- Prisma 7 + PostgreSQL
- Better Auth (`@thallesp/nestjs-better-auth`)
- `class-validator` / `class-transformer` for request DTOs

## Features

- Admins create, update, and delete hackathons
- Anyone can browse hackathons (no auth required)
- Participants can join active hackathons that have not ended
- Join records store who joined which hackathon and when

## Environment variables

Create a `.env` in the project root:

```env
# App
PORT=3000
NODE_ENV=development

# Database (required)
# Runtime queries use DATABASE_URL (pooled URL is fine).
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require"

# Optional: direct (non-pooled) URL for Prisma CLI / migrations.
# If unset, migrations fall back to DATABASE_URL via prisma.config.ts.
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require"

# Better Auth (required for auth flows)
BETTER_AUTH_SECRET="generate-a-long-random-string"
BETTER_AUTH_URL="http://localhost:3000"
```

| Variable | Required | Used by | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | Nest runtime, Prisma CLI (fallback) | Postgres connection string for the app and Prisma Client |
| `DIRECT_URL` | No | Prisma CLI / migrations | Prefer this for `migrate` when using a pooled `DATABASE_URL` |
| `BETTER_AUTH_SECRET` | Yes (auth) | Better Auth | Signing secret for sessions/tokens |
| `BETTER_AUTH_URL` | Yes (auth) | Better Auth | Public base URL of this API (e.g. `http://localhost:3000`) |
| `PORT` | No | Nest | HTTP port (default `3000`) |
| `NODE_ENV` | No | Auth / Nest | Use `production` to enable stricter CSRF/origin checks |

Never commit real `.env` values. Keep secrets out of git.

## Setup

```bash
bun install
# ensure .env is filled in (see above)
bun run prisma:migrate
bun run prisma:generate
bun run start:dev
```

## Prisma setup guide

This project uses **Prisma 7** with:

- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- CLI config: `prisma.config.ts` (datasource URL from env)
- Generated client: `src/generated/prisma/` (do not edit by hand)
- Runtime: `PrismaService` + `@prisma/adapter-pg`

### 1. Configure the database URL

Set `DATABASE_URL` (and optionally `DIRECT_URL`) in `.env`.  
`prisma.config.ts` resolves the CLI URL as `DIRECT_URL || DATABASE_URL`.

### 2. Edit the schema

Change models/enums in `prisma/schema.prisma`. Keep Nest-friendly naming; use `@@map` for table names when needed.

### 3. Format the schema

```bash
bun run prisma:format
```

### 4. Create and apply a migration

```bash
bun run prisma:migrate
# equivalent to: prisma migrate dev
# pass a name when prompted, or:
bunx prisma migrate dev --name your_change_name
```

This compares the schema to the DB, writes SQL under `prisma/migrations/`, applies it, and regenerates the client in most setups.

For production / CI (apply existing migrations only, no new ones):

```bash
bunx prisma migrate deploy
```

### 5. Generate the client

If you only need a regenerated client (no schema migrate):

```bash
bun run prisma:generate
```

`postinstall` also runs `prisma generate` after `bun install`.

### 6. Inspect data (optional)

```bash
bun run prisma:studio
```

### Common workflow cheat sheet

| Goal | Command |
|------|---------|
| Format schema | `bun run prisma:format` |
| New migration in dev | `bun run prisma:migrate` |
| Apply migrations (prod) | `bunx prisma migrate deploy` |
| Regenerate client | `bun run prisma:generate` |
| Browse data | `bun run prisma:studio` |
| Check migration status | `bunx prisma migrate status` |

### Drift / history tips

- Prefer `migrate` over ad-hoc SQL so `_prisma_migrations` stays in sync.
- If the DB already has tables but history is empty, mark past migrations applied with `prisma migrate resolve --applied <name>` before creating new ones (dev only; understand the risk).
- Avoid editing old migration files that have already been applied elsewhere.

## Auth

Better Auth routes are under `/api/auth/*` (sign-up, sign-in, session, etc.).

| Role | Capabilities |
|------|----------------|
| `ADMIN` | Create, update, delete hackathons |
| `PARTICIPANT` | Join hackathons; default role for new users |

Auth is required globally except routes marked `@AllowAnonymous()`.

Promote a user to admin in the database when needed:

```sql
UPDATE "user" SET role = 'ADMIN' WHERE email = 'you@example.com';
```

## API

Responses are wrapped as `{ statusCode, message, data }` (default message `"Success"` unless a route sets `@ResponseMessage`).

### Users

| Method | Path | Access |
|--------|------|--------|
| `GET` | `/user/me` | Authenticated |
| `GET` | `/user/all` | Admin |
| `GET` | `/user/:id` | Authenticated |

### Hackathons

| Method | Path | Access | Notes |
|--------|------|--------|-------|
| `POST` | `/hackathon` | Admin | Sets `authorId` from session |
| `GET` | `/hackathon` | Public | Newest first |
| `GET` | `/hackathon/:id` | Public | |
| `PATCH` | `/hackathon/:id` | Admin | Partial update |
| `DELETE` | `/hackathon/:id` | Admin | |
| `POST` | `/hackathon/:id/join` | Participant | Active + not ended; no duplicate joins |

#### Create body example

```json
{
  "name": "Spring Hackathon 2027",
  "description": "A weekend build event for NestJS and Prisma.",
  "startsAt": "2027-03-01T09:00:00.000Z",
  "endsAt": "2027-03-03T18:00:00.000Z",
  "isActive": true
}
```

- `name`: min 3 characters  
- `description`: optional, 10–1000 characters  
- `startsAt` / `endsAt`: ISO date strings in the future  
- `isActive`: optional boolean (defaults to `true`)

DTO fields `startsAt` / `endsAt` map to Prisma `startDate` / `endDate`.

#### Join rules

Returns `400` if the hackathon is inactive, already ended, or the user already joined. Returns `404` if the hackathon does not exist.

## Tests

```bash
bun run test
bun run test:e2e
bun run test:cov
```
