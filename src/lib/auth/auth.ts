import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  // Postman/API clients often omit Origin; keep CSRF checks on in production.
  advanced: {
    disableOriginCheck: process.env.NODE_ENV !== 'production',
  },
  user: {
    additionalFields: {
      role: {
        type: ['PARTICIPANT', 'ADMIN'],
        required: false,
        defaultValue: 'PARTICIPANT',
        input: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
