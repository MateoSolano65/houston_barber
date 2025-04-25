import { PrismaClient, Role } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Simple hash function for demo purposes only
// In production, use a proper password hashing library
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashPassword('admin123'),
      role: Role.ADMIN,
    },
  });

  console.log('Created admin user:', adminUser.id);

  // Create regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: hashPassword('user123'),
      role: Role.USER,
      posts: {
        create: [
          {
            title: 'First Post',
            content: 'This is my first post content!',
            published: true,
          },
          {
            title: 'Second Post',
            content: 'This is a draft post.',
            published: false,
          },
        ],
      },
    },
  });

  console.log('Created regular user:', regularUser.id);
  console.log('Database seeding completed.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });