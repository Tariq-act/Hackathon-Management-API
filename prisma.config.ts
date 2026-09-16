import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // CLI / migrations prefer DIRECT_URL; fall back to pooled DATABASE_URL.
    // Runtime queries always use DATABASE_URL via PrismaPg in PrismaService.
    url: process.env.DIRECT_URL || env('DATABASE_URL'),
  },
});
