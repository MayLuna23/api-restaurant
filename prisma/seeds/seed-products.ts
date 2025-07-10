import { PrismaClient, Product } from '@prisma/client';

export async function seedProducts(prisma: PrismaClient): Promise<Product[]> {
  const products = [
    { name: 'Classic Burger', price: 9.99 },
    { name: 'French Fries', price: 3.49 },
    { name: 'Soda', price: 2.0 },
  ];

  const seeded = await Promise.all(
    products.map((product) =>
      prisma.product.upsert({
        where: { name: product.name },
        update: {},
        create: product,
      })
    )
  );
9
  console.log('🍔 Products seeded');
  return seeded;
}
