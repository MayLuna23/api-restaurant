import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/seed-users';
import { seedProducts } from './seeds/seed-products';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  const user = await seedUsers(prisma);
  const products = await seedProducts(prisma);
  console.log('✅ Seed completed');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
