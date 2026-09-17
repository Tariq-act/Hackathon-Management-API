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

## Setup

1. Copy env vars into `.env` (at least `DATABASE_URL`; optional `DIRECT_URL`, `BETTER_AUTH_URL`, `PORT`).

2. Install and migrate:

```bash
bun install
bun run prisma:migrate
bun run prisma:generate
```

3. Run:

```bash
bun run start:dev
```

Default port is `3000` (`PORT` in `.env` overrides it).

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

## Prisma scripts

```bash
bun run prisma:format
bun run prisma:migrate
bun run prisma:generate
bun run prisma:studio
```

## Tests

```bash
bun run test
bun run test:e2e
bun run test:cov
```
