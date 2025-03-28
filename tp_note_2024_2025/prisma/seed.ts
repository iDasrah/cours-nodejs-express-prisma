import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// TODO : compléter avec d'éventuelles données de seeding

async function main() {
  // TODO : créer les données de seeding en base
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
