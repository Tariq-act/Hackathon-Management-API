import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    await prisma.$connect();
    const before = await prisma.user.count();
    const email = `verify-${Date.now()}@example.com`;
    const created = await prisma.user.create({
      data: { email, name: 'Connection Verify' },
    });
    const users = await prisma.user.findMany({
      where: { id: created.id },
    });
    await prisma.user.delete({ where: { id: created.id } });
    const after = await prisma.user.count();

    console.log(
      JSON.stringify(
        {
          connected: true,
          countBefore: before,
          createdId: created.id,
          found: users.length === 1,
          countAfter: after,
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
