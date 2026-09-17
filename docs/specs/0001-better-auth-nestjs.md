# 0001 · Better Auth NestJS

**Status**: Assumed
**Date**: 2026-09-17
**Authorized by**: engineer, during /develop

## Owed decision
Auth library wiring on NestJS (package vs manual handler), session model details, CORS and trusted origins, email verification send path, and how user role is stored and enforced.

## Assumption built on
- Use `better-auth` with the Prisma adapter and community `@thallesp/nestjs-better-auth` per the NestJS integration guide (`bodyParser: false`, `AuthModule.forRoot({ auth })`, global AuthGuard with `@AllowAnonymous`).
- Email and password only for the first cut; require email verification; mock/console mailer; no password reset, OAuth, 2FA, orgs, or bearer tokens.
- Session cookies for a web client; protected `me` style endpoint.
- Replace stub Prisma `User` with Better Auth generated schema.
- User `role` is `PARTICIPANT` or `ADMIN`, defaults to `PARTICIPANT`, and cannot be set during sign up (`input: false`).
- Path conditional JSON body parser so Better Auth keeps the raw body on `/api/auth/*`.

## Code area
`src/lib/auth/`, `src/main.ts`, `src/app.module.ts`, `src/module/users/`, `prisma/schema.prisma`, `prisma/migrations/`

## Requirements
- Sign up / sign in / verify with email and password
- Session cookie auth; global guard; public auth routes
- Role field defaults to PARTICIPANT and is not client settable at sign up
- Migrate and regenerate Prisma client

## Ratify
This decision was recorded by /develop, not deliberated. Run `/architect better-auth` to deliberate and ratify it. Until then it stays flagged as an owed decision; it does not block marking the feature `done`.
