import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  const hashedPasswordAdmin = await bcrypt.hash('admin123#', 10);

  // Usuario Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@email.com' },
    update: {},
    create: {
      name: 'Admin',
      role: 'admin',
      email: 'admin@email.com',
      password: hashedPasswordAdmin,
    },
  });

  // Usuario Waiter
  const hashedPasswordWaiter = await bcrypt.hash('mayra123#', 10);
  const waiter = await prisma.user.upsert({
    where: { email: 'waiter@email.com' },
    update: {},
    create: {
      name: 'Mayra Luna',
      role: 'waiter',
      email: 'mayra@email.com',
      password: hashedPasswordWaiter,
    },
  });

  console.log('👤 Admin and Waiter users seeded');
  return admin; // Devuelve el admin como referencia para otras seeds
}
